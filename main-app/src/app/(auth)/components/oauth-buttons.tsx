'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLastUsedProvider } from '@/hooks/auth/use-last-used-provider';
import { useSafeRedirect } from '@/hooks/auth/use-safe-redirect';
import { GithubOAuthClickFunction, GoogleOAuthClickFunction } from '@/lib/apis';
import { AuthMethod } from '@/types/user';
import { useState, useCallback } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa6';
import type { IconType } from 'react-icons';

type OAuthProvider = 'google' | 'github';

interface OAuthConfig {
  icon: IconType;
  label: string;
  authMethod: AuthMethod;
  onClick: (options: { redirect?: string }) => void;
}

const oauthConfig: Record<OAuthProvider, OAuthConfig> = {
  google: {
    icon: FaGoogle,
    label: 'Sign in with Google',
    authMethod: AuthMethod.GOOGLE,
    onClick: GoogleOAuthClickFunction,
  },
  github: {
    icon: FaGithub,
    label: 'Sign in with GitHub',
    authMethod: AuthMethod.GITHUB,
    onClick: GithubOAuthClickFunction,
  },
};

interface OAuthButtonProps {
  provider: OAuthProvider;
  redirectTo: string;
}

function OAuthButton({ provider, redirectTo }: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isLastUsed } = useLastUsedProvider();
  const config = oauthConfig[provider];
  const Icon = config.icon;

  const handleClick = useCallback(() => {
    setIsLoading(true);
    config.onClick({ redirect: redirectTo });
  }, [config, redirectTo]);

  return (
    <Button variant="outline" className="relative" onClick={handleClick} disabled={isLoading}>
      <Icon className="h-4 w-4" />
      <span>{config.label}</span>
      {isLastUsed(config.authMethod) && <Badge className="absolute right-1 top-1">Last Used</Badge>}
    </Button>
  );
}

// Keep individual exports for backward compatibility
export const OAuthWithGoogle = ({ redirectTo }: { redirectTo: string }) => (
  <OAuthButton provider="google" redirectTo={redirectTo} />
);

export const OAuthWithGithub = ({ redirectTo }: { redirectTo: string }) => (
  <OAuthButton provider="github" redirectTo={redirectTo} />
);

export const OAuthButtons = () => {
  const redirectTo = useSafeRedirect('/dashboard');

  return (
    <div className="flex flex-col gap-2">
      <OAuthButton provider="google" redirectTo={redirectTo} />
      <OAuthButton provider="github" redirectTo={redirectTo} />
    </div>
  );
};
