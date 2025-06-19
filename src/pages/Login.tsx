import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
// Optional: Import a Google icon if you have one, e.g., from 'lucide-react' if using shadcn/ui
// import { Chrome } from 'lucide-react'; // Example, replace if you use different icons

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // NEW: Get signInWithGoogle from useAuth
  const { signIn, signInWithGoogle, user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    }

    setLoading(false);
  };

  // NEW: Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setLoading(true); // Indicate loading state for the button

    const { error } = await signInWithGoogle(); // Call the new Google sign-in function

    if (error) {
      // This error usually happens *before* the redirect (e.g., misconfiguration)
      toast({
        title: "Google Sign-in Failed",
        description: error.message || "Something went wrong during Google sign-in setup.",
        variant: "destructive"
      });
      setLoading(false); // Reset loading if an immediate error occurs
    }
    // If no immediate error, a redirect has been initiated.
    // The loading state will remain true until the page reloads after redirect.
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">HinduGPT</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* NEW: Google Sign-in Button */}
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
        </div>

        <Button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
        >
            {/* You can add a Google icon here */}
            {/* <Chrome className="h-5 w-5" /> */}
            {loading ? 'Redirecting...' : 'Sign In with Google'}
        </Button>


        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-600 hover:text-orange-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;