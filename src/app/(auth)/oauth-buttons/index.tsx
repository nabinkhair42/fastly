import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa6';
import { toast } from 'sonner';

export const OAuthWithGoogle = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      // Redirect to Google OAuth endpoint
      window.location.href = '/api/auth/google';
    } catch (error) {
      console.error('Google OAuth error:', error);
      toast.error('Failed to initiate Google sign-in');
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size={'icon'}
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      <FaGoogle className="h-4 w-4" />
      <span className="sr-only">Sign in with Google</span>
    </Button>
  );
};

export const OAuthWithGithub = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubSignIn = async () => {
    try {
      setIsLoading(true);
      // Redirect to GitHub OAuth endpoint
      window.location.href = '/api/auth/github';
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      toast.error('Failed to initiate GitHub sign-in');
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size={'icon'}
      onClick={handleGithubSignIn}
      disabled={isLoading}
    >
      <FaGithub className="h-4 w-4" />
      <span className="sr-only">Sign in with GitHub</span>
    </Button>
  );
};

export const OAuthButtons = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <OAuthWithGoogle />
      <OAuthWithGithub />
    </div>
  );
};
