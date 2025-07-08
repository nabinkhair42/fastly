'use client';

import { useSession } from '@/hooks/useSession';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Component that protects routes by redirecting unauthenticated users
 * Usage: Wrap your protected pages/components with this
 */
export default function ProtectedRoute({
  children,
  fallback,
  redirectTo = '/log-in',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader className="animate-spin" size={24} />
        </div>
      )
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
}

/**
 * HOC (Higher-Order Component) version for wrapping pages
 */
export function withProtectedRoute<T extends object>(
  Component: React.ComponentType<T>,
  options?: { redirectTo?: string; fallback?: React.ReactNode }
) {
  return function ProtectedComponent(props: T) {
    return (
      <ProtectedRoute
        redirectTo={options?.redirectTo}
        fallback={options?.fallback}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
