'use client';

import ScreenLoader from '@/components/screen-loader';
import { useRedirectIfAuthenticated } from '@/hooks/auth/useRequireAuth';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { shouldShow, isLoading } = useRedirectIfAuthenticated('/dashboard');

  if (isLoading) {
    return <ScreenLoader />;
  }

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen place-content-center">
      <div className="mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
