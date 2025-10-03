import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export const DEFAULT_REDIRECT = '/dashboard';

const DENY_PREFIXES = [
  '/log-in',
  '/create-account',
  '/forgot-password',
  '/reset-password',
  '/email-verification',
  '/oauth',
  '/api',
  '/_next',
  '/static',
];

const isDenied = (path: string) =>
  DENY_PREFIXES.some(prefix => path === prefix || path.startsWith(`${prefix}/`));

export const sanitizeRedirect = (
  redirectParam: string | null | undefined,
  fallback: string = DEFAULT_REDIRECT
) => {
  if (!redirectParam) {
    return fallback;
  }

  if (!redirectParam.startsWith('/') || redirectParam.startsWith('//')) {
    return fallback;
  }

  const [path] = redirectParam.split('?');

  if (isDenied(path)) {
    return fallback;
  }

  return redirectParam;
};

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
    return sanitizeRedirect(redirectParam, fallback);
  }, [fallback, searchParams]);

  useEffect(() => {
    router.prefetch(redirectTo);
  }, [redirectTo, router]);

  return redirectTo;
};
