import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

const DEFAULT_REDIRECT = '/dashboard';

/**
 * Returns a sanitized redirect path derived from the `redirect` query parameter.
 * Falls back to `/dashboard` when the parameter is missing or unsafe.
 * Also prefetches the computed route for snappier transitions.
 */
export const useSafeRedirect = (fallback: string = DEFAULT_REDIRECT) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const redirectTo = useMemo(() => {
    const redirectParam = searchParams?.get('redirect');

    if (!redirectParam) {
      return fallback;
    }

    if (!redirectParam.startsWith('/') || redirectParam.startsWith('//')) {
      return fallback;
    }

    return redirectParam;
  }, [fallback, searchParams]);

  useEffect(() => {
    router.prefetch(redirectTo);
  }, [redirectTo, router]);

  return redirectTo;
};
