
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save } from 'lucide-react';

interface ProfileFormActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const ProfileFormActions: React.FC<ProfileFormActionsProps> = ({
  isEditing,
  onEdit,
  onCancel,
  onSave
}) => {
  if (!isEditing) {
    return (
      <Button
        type="button"
        onClick={onEdit}
        variant="outline"
        size="sm"
        className="text-orange-600 border-orange-600 hover:bg-orange-50"
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit
      </Button>
    );
  }

  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        onClick={onSave}
        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Changes
      </Button>
    </div>
  );
};

export default ProfileFormActions;
