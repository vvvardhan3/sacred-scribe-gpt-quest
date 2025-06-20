// src/app/reset-password/page.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; // Adjust path if necessary
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // For new password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm password
  const navigate = useNavigate();
  const { toast } = useToast();

  // On mount, check if a session is already established by the URL's token
  // Supabase's onAuthStateChange will handle setting the session when the user lands here
  // via a password reset email link. We don't need to manually parse tokens here.
  useEffect(() => {
    // You can optionally check the current user/session here if needed,
    // but the update logic below will rely on the session being set.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        // If the session is null after an event, it might mean the token expired or is invalid.
        // Or if the user just logged in/reset, this event will fire.
        // For reset password, the session will be temporarily set for the user linked to the token.
    });

    return () => {
        if (subscription) {
            subscription.unsubscribe();
        }
    };
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (password.length < 6) { // Supabase default minimum password length is 6
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Update the user's password. Supabase will use the current session (set by the recovery token)
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated. Please log in with your new password.",
      });
      navigate('/login'); // Redirect to login page after successful reset
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Set New Password</h1>
          <p className="text-gray-600 text-sm md:text-base">Enter and confirm your new password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="new-password" className="text-gray-700">New Password</Label>
            </div>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="confirm-password" className="text-gray-700">Confirm New Password</Label>
            </div>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base pr-10"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold text-base transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Back to Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;