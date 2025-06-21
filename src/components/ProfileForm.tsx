
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Save, User, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  profile_picture_url: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string;
}

interface ProfileFormProps {
  profile: UserProfile;
  userEmail: string;
  onUpdateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

interface FormData {
  display_name: string;
  first_name: string;
  last_name: string;
  email: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, userEmail, onUpdateProfile }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      display_name: profile.display_name || '',
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      email: userEmail,
    },
    values: {
      display_name: profile.display_name || '',
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      email: userEmail,
    }
  });

  const getInitials = () => {
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    const displayName = profile.display_name || '';
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (displayName) {
      const names = displayName.split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      }
      return displayName.charAt(0).toUpperCase();
    }
    
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Update profile data
      await onUpdateProfile({
        display_name: data.display_name,
        first_name: data.first_name,
        last_name: data.last_name,
      });

      // Update email if changed
      if (data.email !== userEmail) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email,
        });
        if (emailError) {
          console.error('Error updating email:', emailError);
          toast({
            title: "Warning",
            description: "Profile updated but email update failed. Please try updating email separately.",
            variant: "destructive",
          });
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    form.reset({
      display_name: profile.display_name || '',
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      email: userEmail,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg border-4 border-white">
            <span className="text-3xl font-bold text-white">{getInitials()}</span>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {profile.display_name || profile.first_name 
              ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.display_name
              : 'User Profile'
            }
          </h2>
          <p className="text-gray-600">{profile.email}</p>
          <p className="text-sm text-gray-500 capitalize">{profile.role || 'user'}</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          {!isEditing && (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Display Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      placeholder="Enter your display name"
                      className={!isEditing ? "bg-gray-50 text-gray-700 border-gray-200" : "bg-white text-gray-900"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        placeholder="Enter your first name"
                        className={!isEditing ? "bg-gray-50 text-gray-700 border-gray-200" : "bg-white text-gray-900"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        placeholder="Enter your last name"
                        className={!isEditing ? "bg-gray-50 text-gray-700 border-gray-200" : "bg-white text-gray-900"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      disabled={!isEditing}
                      placeholder="Enter your email"
                      className={!isEditing ? "bg-gray-50 text-gray-700 border-gray-200" : "bg-white text-gray-900"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && (
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileForm;
