'use client';

import { Badge } from '@/components/ui/badge';
import { useLastUsedProvider } from '@/hooks/auth/useLastUsedProvider';

import { Button } from '@/components/ui/button';
import {
  GithubOAuthClickFunction,
  GoogleOAuthClickFunction,
} from '@/lib/apis/oAuth';
import { AuthMethod } from '@/types/user';
import { useState } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa6';

export const OAuthWithGoogle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isLastUsed } = useLastUsedProvider();

  const handleGoogleOAuth = () => {
    setIsLoading(true);
    GoogleOAuthClickFunction();
  };

  return (
    <Button
      variant="outline"
      className="h-14 relative"
      onClick={handleGoogleOAuth}
      disabled={isLoading}
    >
      <FaGoogle className="h-4 w-4" />
      <span className="">Sign in with Google</span>
      {isLastUsed(AuthMethod.GOOGLE) && (
        <Badge className="absolute right-1 top-1">Last Used</Badge>
      )}
    </Button>
  );
};

export const OAuthWithGithub = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isLastUsed } = useLastUsedProvider();

  const handleGithubOAuth = () => {
    setIsLoading(true);
    GithubOAuthClickFunction();
  };

  return (
    <Button
      variant="outline"
      className="h-14 relative"
      onClick={handleGithubOAuth}
      disabled={isLoading}
    >
      <FaGithub className="h-4 w-4" />
      <span className="">Sign in with GitHub</span>
      {isLastUsed(AuthMethod.GITHUB) && (
        <Badge className="absolute right-1 top-1">Last Used</Badge>
      )}
    </Button>
  );
};

export const OAuthButtons = () => {
  return (
    <div className="flex flex-col gap-2">
      <OAuthWithGoogle />
      <OAuthWithGithub />
    </div>
  );
};
