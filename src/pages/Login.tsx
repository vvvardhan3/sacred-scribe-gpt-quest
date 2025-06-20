import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import {Eye, EyeOff } from "lucide-react"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, signInWithFacebook, user } = useAuth(); 
  const { toast } = useToast();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

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
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: "Google Sign-in Failed",
        description:
          error.message || "Something went wrong during Google sign-in setup.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    const { error } = await signInWithFacebook();
    if (error) {
      toast({
        title: "Facebook Sign-in Failed",
        description:
          error.message ||
          "Something went wrong during Facebook sign-in setup.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // No specific handler for Twitter yet, as it's "Coming Soon"

  return (
    // Outer container for the light gray background and centering
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Main Login Card - matches screenshot */}
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {" "}
        {/* Increased rounded corners, fixed max-width */}
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back
          </h1>
          <span className="text-gray-600 text-sm ">
            Login with your Google or Facebook
          </span>
        </div>
        {/* Social Login Buttons */}
        <div className="space-y-3">
          {/* Google Button */}
          <Button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
            disabled={loading}
          >
            Login with Google
          </Button>

          <Button
            onClick={handleFacebookSignIn}
            className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
            disabled={loading}
          >
            Login with Facebook
          </Button>

          {/* Twitter (X) Button - Coming Soon */}
          <Button
            className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 bg-white text-gray-400 hover:bg-gray-50 rounded-lg text-sm  cursor-not-allowed"
            disabled={loading}
          >
            Login with X (Twitter)
          </Button>
        </div>
        {/* Or continue with separator */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        {/* Email and Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
            </div>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="rohitsharma@example.com"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              {/* Work the forgot password link logic, for now it is not working.*/}
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base pr-10" // Add pr-10 for icon space
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Main Login Button */}
          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold text-base transition-colors duration-200" // Dark background button
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
        {/* Legal Text at the very bottom (inside the card) */}
        <div className="text-center text-xs text-gray-500 mt-6 pt-4 border-t border-gray-200">
          By clicking continue, you agree to our
          <br />
          <Link to="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default Login;
