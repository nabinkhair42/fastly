'use client';

import { Button } from '@/components/ui/button';
import {
  GithubOAuthClickFunction,
  GoogleOAuthClickFunction,
} from '@/lib/apis/oAuth';
import { useState } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa6';

export const OAuthWithGoogle = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleOAuth = () => {
    setIsLoading(true);
    GoogleOAuthClickFunction();
  };

  return (
    <Button
      variant="outline"
      size={'icon'}
      onClick={handleGoogleOAuth}
      disabled={isLoading}
    >
      <FaGoogle className="h-4 w-4" />
      <span className="sr-only">Sign in with Google</span>
    </Button>
  );
};

export const OAuthWithGithub = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubOAuth = () => {
    setIsLoading(true);
    GithubOAuthClickFunction();
  };

  return (
    <Button
      variant="outline"
      size={'icon'}
      onClick={handleGithubOAuth}
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
