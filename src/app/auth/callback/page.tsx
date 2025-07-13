'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) {
      return;
    }

    const processOAuthCallback = async () => {
      try {
        hasProcessed.current = true;

        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const userStr = searchParams.get('user');
        const redirectTo = searchParams.get('redirectTo') || '/dashboard';
        const isNewUser = searchParams.get('isNewUser') === 'true';
        const linkedProvider = searchParams.get('linkedProvider');

        if (!accessToken || !refreshToken || !userStr) {
          throw new Error('Missing authentication data');
        }

        const user = JSON.parse(userStr);

        // Log the user in
        login(accessToken, refreshToken, user);

        // Show success message
        if (isNewUser) {
          toast.success('Account created successfully! Welcome!');
        } else if (linkedProvider) {
          toast.success(`${linkedProvider} account linked successfully!`);
        } else {
          toast.success('Signed in successfully!');
        }

        // Redirect to intended destination
        router.push(redirectTo);
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error('Authentication failed. Please try again.');
        router.push('/log-in');
      } finally {
        setIsProcessing(false);
      }
    };

    processOAuthCallback();
  }, [login, router, searchParams]); // Empty dependency array since we're using ref to prevent re-execution

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Completing sign in...</p>
        </div>
      </div>
    );
  }

  return null;
}
