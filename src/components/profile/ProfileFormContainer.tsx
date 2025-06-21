
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProfileAvatar from './ProfileAvatar';
import ProfileFormFields from './ProfileFormFields';
import ProfileFormActions from './ProfileFormActions';

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

interface ProfileFormContainerProps {
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

const ProfileFormContainer: React.FC<ProfileFormContainerProps> = ({ 
  profile, 
  userEmail, 
  onUpdateProfile 
}) => {
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

  const onSubmit = async (data: FormData) => {
    try {
      await onUpdateProfile({
        display_name: data.display_name,
        first_name: data.first_name,
        last_name: data.last_name,
      });

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-8">
      <ProfileAvatar profile={profile} />

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          <ProfileFormActions
            isEditing={isEditing}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ProfileFormFields
              form={form}
              isEditing={isEditing}
              userEmail={userEmail}
            />
            
            {isEditing && (
              <ProfileFormActions
                isEditing={isEditing}
                onEdit={handleEdit}
                onCancel={handleCancel}
                onSave={handleSave}
              />
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileFormContainer;
