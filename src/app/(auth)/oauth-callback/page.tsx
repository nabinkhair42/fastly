import { OAuthCallback } from '@/components/oauth-callback';
import ScreenLoader from '@/components/screen-loader';
import { Suspense } from 'react';

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <OAuthCallback />
    </Suspense>
  );
}
