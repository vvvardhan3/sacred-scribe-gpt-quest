
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import ProfileForm from '@/components/ProfileForm';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserProfile {
  id: string;
  display_name: string;
  first_name: string | null;
  last_name: string | null;
  profile_picture_url: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      console.log('Fetching profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      console.log('Profile fetched:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    if (!user) return;

    try {
      console.log('Updating profile with data:', updatedData);
      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id);

      if (error) throw error;

      // Update local state immediately
      setProfile(prev => {
        const newProfile = prev ? { ...prev, ...updatedData } : null;
        console.log('Updated profile state:', newProfile);
        return newProfile;
      });

      // If profile picture was updated, refetch to ensure we have the latest data
      if (updatedData.profile_picture_url) {
        console.log('Profile picture updated, refetching profile...');
        setTimeout(() => fetchProfile(), 500); // Small delay to ensure database is updated
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-orange-600 hover:bg-orange-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Profile Settings</h1>
          {profile && user && (
            <ProfileForm 
              profile={profile} 
              userEmail={user.email || ''} 
              onUpdateProfile={updateProfile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
