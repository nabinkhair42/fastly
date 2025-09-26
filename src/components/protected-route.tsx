'use client';

import { useSession } from '@/hooks/auth/useSession';
import { Loader } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that protects routes by redirecting unauthenticated users
 * Usage: Wrap your protected pages/components with this
 */
export default function ProtectedRoute({
  children,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to login if not authenticated and add the link path where user wanted to go as param
  const redirectToWithParam = `/log-in?redirect=${encodeURIComponent(pathname)}`;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectToWithParam);
    }
  }, [isAuthenticated, isLoading, router, redirectToWithParam]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="flex min-h-[100svh] items-center justify-center bg-background">
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
      <ProtectedRoute fallback={options?.fallback}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
