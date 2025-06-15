import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Camera, Save, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ImageCropper from '@/components/ImageCropper';

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
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentProfilePicture, setCurrentProfilePicture] = useState(profile.profile_picture_url);
  const [imageKey, setImageKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local profile picture when profile prop changes
  React.useEffect(() => {
    setCurrentProfilePicture(profile.profile_picture_url);
    setImageKey(prev => prev + 1); // Force re-render
  }, [profile.profile_picture_url]);

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

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('Image selected:', file);
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedImage(file);
      setShowImageCropper(true);
    }
  };

  const handleImageCrop = async (croppedImageBlob: Blob) => {
    if (!user) return;

    setUploading(true);
    try {
      console.log('Uploading cropped circular image...');
      const fileExt = 'png'; // Changed to PNG to preserve transparency
      const fileName = `${user.id}/profile-${Date.now()}.${fileExt}`;

      // Upload the cropped image
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, croppedImageBlob, {
          upsert: true,
          contentType: 'image/png',
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get the public URL with cache-busting timestamp
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      const finalUrl = `${publicUrl}?t=${Date.now()}`;
      console.log('Circular image uploaded successfully, URL:', finalUrl);

      // Update the profile with the new image URL
      await onUpdateProfile({ profile_picture_url: finalUrl });
      
      // Update local state immediately
      setCurrentProfilePicture(finalUrl);
      setImageKey(prev => prev + 1);

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setShowImageCropper(false);
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
      {/* Profile Picture Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-lg border-4 border-white">
            {currentProfilePicture ? (
              <img
                key={`${imageKey}-${currentProfilePicture}`}
                src={`${currentProfilePicture}${currentProfilePicture.includes('?') ? '&' : '?'}cache=${imageKey}`}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                style={{ 
                  objectFit: 'cover',
                  objectPosition: 'center center'
                }}
                onLoad={() => console.log('Profile image loaded successfully')}
                onError={(e) => {
                  console.error('Profile image failed to load:', currentProfilePicture);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            {!currentProfilePicture && (
              <span className="text-3xl font-bold text-white">{getInitials()}</span>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700 border-2 border-white"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        {uploading && (
          <p className="text-sm text-gray-600">Uploading...</p>
        )}
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

      {/* Image Cropper Modal */}
      {showImageCropper && selectedImage && (
        <ImageCropper
          image={selectedImage}
          onCrop={handleImageCrop}
          onCancel={() => {
            console.log('Cropping cancelled');
            setShowImageCropper(false);
            setSelectedImage(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
        />
      )}
    </div>
  );
};

export default ProfileForm;
