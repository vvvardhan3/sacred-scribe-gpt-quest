// src/app/forgot-password/page.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; // Adjust path if necessary
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // The redirectTo URL must be registered in your Supabase Auth Redirect URLs
    const redirectToUrl = `${window.location.origin}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectToUrl,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setMessage("Please check your email for the password reset link.");
      toast({
        title: "Email Sent",
        description: "Please check your email for the password reset link.",
      });
      setEmail(''); // Clear the email field
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-600 text-sm md:text-base">Enter your email to receive a password reset link.</p>
        </div>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="suryakumar@example.com"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold text-base transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Log In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;