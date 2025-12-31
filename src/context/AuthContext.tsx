'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client';
import { login, signup } from '@/services/auth.service';
import { db } from '@/config/drizzle.config';
import { profiles } from '@/db/schema/profiles';
import { eq } from "drizzle-orm";
import { ProfileResponseDto } from '@/db/dtos/profiles.dto';
import { useGetProfile } from '@/hooks/useProfile';
import { useRouter } from 'next/navigation';

interface Response {
  error: string | null;
  success: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (formData: FormData) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (formData: FormData) => Promise<void>;
  profile: ProfileResponseDto | null;
  response: Response | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [response, setResponse] = useState<Response | null>(null);
  const [profile, setProfile] = useState<ProfileResponseDto | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true)
  const { mutate: getProfile, isPending: isProfileLoading } = useGetProfile();
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      // get profile from hooks
      setLoading(isProfileLoading)
      getProfile(data.session?.user?.id || "", {
        onSuccess: (profileData) => {
          setProfile(profileData);
        }
      });
      
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (formData: FormData) => {
    setLoading(true);
    const { error } = await login(formData);
    // render the eerror on the login page in params 
    if (error) {
      setLoading(false);
      console.log('Login error:', error);
      setResponse({ error: error, success: null });
      return;
    }

    
    setLoading(false);
      if (!error) {
        setResponse({ error: null, success: "Login successful" });
        // O want to reload the app to fetch the profile data
        router.push("/");
        router.refresh();
      }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setResponse({ error: null, success: "Logged out successfully" });
    setSession(null);
    router.push("/login");
    router.refresh();
  };

  const signUp = async (formData: FormData) => {
    setLoading(true);
    const { error } = await signup(formData);
    if (error) {
      setLoading(false);
      console.log('Signup error:', error);
      setResponse({ error: error?.message || 'Signup failed', success: null });
      return;
    }
    setLoading(false);
    setResponse({ error: null, success: "Account created successfully" });
    router.push("/login");
    router.refresh();
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut, signUp, profile, response }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
