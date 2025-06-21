
import React from 'react';
import ProfileFormContainer from './profile/ProfileFormContainer';

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

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, userEmail, onUpdateProfile }) => {
  return (
    <ProfileFormContainer
      profile={profile}
      userEmail={userEmail}
      onUpdateProfile={onUpdateProfile}
    />
  );
};

export default ProfileForm;
