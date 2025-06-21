
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface FormData {
  display_name: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface ProfileFormFieldsProps {
  form: UseFormReturn<FormData>;
  isEditing: boolean;
  userEmail: string;
}

const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({ form, isEditing, userEmail }) => {
  return (
    <>
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
    </>
  );
};

export default ProfileFormFields;
