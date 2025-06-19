import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Make sure this path is correct for your project
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Signup = () => {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State for loading and auth status
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth(); // Get signUp function and current user from AuthContext
  const { toast } = useToast(); // Hook for displaying toasts/notifications

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Client-side validation for password match
    if (password !== confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return; // Stop the function if passwords don't match
    }

    // Client-side validation for password length (Supabase default is 6 characters)
    if (password.length < 6) {
      toast({
        title: "Registration Failed",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return; // Stop the function if password is too short
    }

    setLoading(true); // Set loading state to true while waiting for API response

    // Call the signUp function from AuthContext, passing all required data
    // firstName, lastName, and displayName are sent in the 'data' options object
    const { error } = await signUp(email, password, {
      firstName,
      lastName,
      displayName
    });

    if (error) {
      // Show error toast if signup fails
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      // Show success toast if signup is successful
      toast({
        title: "Registration Successful!",
        description: "Please check your email to verify your account.",
      });
      // Optionally, clear form fields after successful signup
      // setEmail('');
      // setPassword('');
      // setDisplayName('');
      // setFirstName('');
      // setLastName('');
      // setConfirmPassword('');
    }

    setLoading(false); // Reset loading state
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">HinduGPT</h2>
          <p className="text-gray-600">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name Input */}
          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {/* First Name Input */}
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {/* Last Name Input */}
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {/* Email Input */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {/* Password Input */}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6} // HTML5 validation for min length
              className="mt-1"
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6} // HTML5 validation for min length
              className="mt-1"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        {/* Link to Login Page */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-600 hover:text-orange-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;