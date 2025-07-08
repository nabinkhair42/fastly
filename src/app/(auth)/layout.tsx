'use client';

import { useRedirectIfAuthenticated } from '@/hooks/useRequireAuth';
import { Loader } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { shouldShow, isLoading } = useRedirectIfAuthenticated('/users');

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader className="animate-spin" size={24} />
      </div>
    );
  }

  if (!shouldShow) {
    return null; // Will redirect to /users
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
