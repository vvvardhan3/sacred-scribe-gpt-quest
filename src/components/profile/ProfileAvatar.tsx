
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string | null;
}

interface ProfileAvatarProps {
  profile: UserProfile;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ profile }) => {
  const { user } = useAuth();

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

  return (
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
  );
};

export default ProfileAvatar;
