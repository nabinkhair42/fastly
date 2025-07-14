import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FaFacebook, FaGithub, FaGoogle } from 'react-icons/fa6';

export const OAuthWithGoogle = () => {
  return (
    <Button
      variant="outline"
      size={'icon'}
      onClick={() => {
        toast.warning('Working on Google OAuth integration');
      }}
    >
      <FaGoogle className="h-4 w-4" />
      <span className="sr-only">Sign in with Google</span>
    </Button>
  );
};

export const OAuthWithGithub = () => {
  return (
    <Button
      variant="outline"
      size={'icon'}
      onClick={() => {
        toast.warning('Working on GitHub OAuth integration');
      }}
    >
      <FaGithub className="h-4 w-4" />
      <span className="sr-only">Sign in with GitHub</span>
    </Button>
  );
};

export const OAuthWithFacebook = () => {
  return (
    <Button
      variant="outline"
      size={'icon'}
      onClick={() => {
        toast.warning('Working on Facebook OAuth integration');
      }}
    >
      <FaFacebook className="h-4 w-4" />
      <span className="sr-only">Sign in with Facebook</span>
    </Button>
  );
};

export const OAuthButtons = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <OAuthWithGoogle />
      <OAuthWithGithub />
      <OAuthWithFacebook />
    </div>
  );
};
