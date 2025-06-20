// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client'; // Adjust path if necessary
import { log } from 'console';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, data?: { firstName?: string; lastName?: string; displayName?: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: any | null }>;
  signInWithFacebook: () => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  console.log( "AuthContext: ",AuthContext);
  
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, data?: { firstName?: string; lastName?: string; displayName?: string }) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: data?.firstName,
          last_name: data?.lastName,
          display_name: data?.displayName
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // NEW: Function to sign in with Google
  const signInWithGoogle = async () => {
    // The redirect URL where the user will be sent after Google authentication
    // This should match one of your "Authorized redirect URIs" in Google Cloud Console
    // and ideally the one Supabase uses by default.
    const redirectUrl = `${window.location.origin}/dashboard`; 

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        // You can add scopes here if you need more user data from Google
        // scopes: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      },
    });

    // Supabase signInWithOAuth initiates a redirect, so the error handling here
    // typically won't catch redirect-related errors directly.
    // Errors after the redirect (e.g., if session is not created) are caught by onAuthStateChange.
    if (error) {
      console.error("Error initiating Google sign-in:", error);
      return { error };
    }
    return { error: null }; // No immediate error, redirect initiated
  };

    const signInWithFacebook = async () => {
    const redirectUrl = `${window.location.origin}/dashboard`; // Same redirect as Google, or your preferred post-login path

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: redirectUrl,
        // You can specify scopes here if you need more data from Facebook
        // scopes: 'public_profile,email', // Default scopes are usually enough
      },
    });

    if (error) {
      console.error("Error initiating Facebook sign-in:", error);
      return { error };
    }
    return { error: null };
  };


  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle, 
    signInWithFacebook
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};