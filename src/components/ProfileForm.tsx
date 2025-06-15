import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Save, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  display_name: string;
  first_name: string | null;
  last_name: string | null;
  profile_picture_url: string | null;
}

interface ProfileFormProps {
  profile: UserProfile;
  userEmail: string;
  onUpdateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

interface FormData {
  display_name: string;
  email: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, userEmail, onUpdateProfile }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      display_name: profile.display_name || '',
      email: userEmail,
    },
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
      });

      // Update email if changed
      if (data.email !== userEmail) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email,
        });
        if (emailError) throw emailError;
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

  return (
    <div className="space-y-8">
      {/* Profile Picture Section - TODO: Implement profile picture upload in future release */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-lg border-4 border-white">
            <span className="text-3xl font-bold text-white">{getInitials()}</span>
          </div>
          {/* TODO: Re-implement profile picture upload functionality in future release
              - Add camera button
              - Implement image cropper
              - Handle image upload to Supabase storage
              - Display uploaded profile pictures
          */}
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
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
                      className={!isEditing ? "bg-gray-50 text-gray-700 border-gray-200" : "bg-white text-gray-900"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      className={!isEditing ? "bg-gray-50 text-gray-700 border-gray-200" : "bg-white text-gray-900"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              {!isEditing ? (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      form.reset();
                    }}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileForm;
