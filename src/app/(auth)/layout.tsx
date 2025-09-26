'use client';

import ScreenLoader from '@/components/screen-loader';
import { useRedirectIfAuthenticated } from '@/hooks/auth/useRequireAuth';
import { useSafeRedirect } from '@/hooks/auth/useSafeRedirect';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const redirectTarget = useSafeRedirect('/dashboard');
  const { shouldShow, isLoading } = useRedirectIfAuthenticated(redirectTarget);

  if (isLoading) {
    return <ScreenLoader />;
  }

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="bg-background min-h-[100svh] place-content-center">
      <div className="mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
