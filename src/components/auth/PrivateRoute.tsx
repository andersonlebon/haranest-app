'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login'); // redirect if not authenticated
    }
  }, [loading, user, router]);

  if (loading || !user) return <div>Loading...</div>;

  return <>{children}</>;
};
