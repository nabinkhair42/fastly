'use client';

import { Badge } from '@/components/ui/badge';
import { useLastUsedProvider } from '@/hooks/auth/use-last-used-provider';
import { useSafeRedirect } from '@/hooks/auth/use-safe-redirect';

import { Button } from '@/components/ui/button';
import { GithubOAuthClickFunction, GoogleOAuthClickFunction } from '@/lib/apis/oauth';
import { AuthMethod } from '@/types/user';
import { useState } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa6';

interface OAuthButtonProps {
  redirectTo: string;
}

export const OAuthWithGoogle = ({ redirectTo }: OAuthButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isLastUsed } = useLastUsedProvider();

  const handleGoogleOAuth = () => {
    setIsLoading(true);
    GoogleOAuthClickFunction({ redirect: redirectTo });
  };

  return (
    <Button variant="outline" className="relative" onClick={handleGoogleOAuth} disabled={isLoading}>
      <FaGoogle className="h-4 w-4" />
      <span className="">Sign in with Google</span>
      {isLastUsed(AuthMethod.GOOGLE) && <Badge className="absolute right-1 top-1">Last Used</Badge>}
    </Button>
  );
};

export const OAuthWithGithub = ({ redirectTo }: OAuthButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isLastUsed } = useLastUsedProvider();

  const handleGithubOAuth = () => {
    setIsLoading(true);
    GithubOAuthClickFunction({ redirect: redirectTo });
  };

  return (
    <Button variant="outline" className="relative" onClick={handleGithubOAuth} disabled={isLoading}>
      <FaGithub className="h-4 w-4" />
      <span className="">Sign in with GitHub</span>
      {isLastUsed(AuthMethod.GITHUB) && <Badge className="absolute right-1 top-1">Last Used</Badge>}
    </Button>
  );
};

export const OAuthButtons = () => {
  const redirectTo = useSafeRedirect('/dashboard');

  return (
    <div className="flex flex-col gap-2">
      <OAuthWithGoogle redirectTo={redirectTo} />
      <OAuthWithGithub redirectTo={redirectTo} />
    </div>
  );
};
