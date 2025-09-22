'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/providers/AuthProvider';
import { siteConfig } from '@/seo/metadata';
import Link from 'next/link';
import { GiCube } from 'react-icons/gi';

import { ThemeSwitcher } from '../ui/theme-switcher';

export default function SiteHeader() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      aria-label="Site header"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label={siteConfig.name}
            >
              <GiCube height={30} width={30} />
              <span className="font-semibold">Fastly</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {isLoading ? null : isAuthenticated ? (
              <Button asChild size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/log-in">Log in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/create-account">Create account</Link>
                </Button>
              </div>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </div>
      <Separator className="md:hidden" />
    </header>
  );
}
