'use client';

import { useSession } from '@/hooks/auth/use-session';
import { Loader } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that protects routes by redirecting unauthenticated users
 * Usage: Wrap your protected pages/components with this
 */
export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const redirectToWithParam = useMemo(() => {
    const query = searchParams.toString();
    const target = query ? `${pathname}?${query}` : pathname;
    return `/log-in?redirect=${encodeURIComponent(target)}`;
  }, [pathname, searchParams]);

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
