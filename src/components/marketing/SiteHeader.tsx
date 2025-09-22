'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/providers/AuthProvider';
import { siteConfig } from '@/seo/metadata';
import { Github } from 'lucide-react';
import Link from 'next/link';

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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={siteConfig.ogImage ? '/icon.png' : '/icon.png'}
                alt="Logo"
                className="h-6 w-6"
              />
              <span className="font-semibold">{siteConfig.name}</span>
            </Link>
          </div>

          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Primary"
          >
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#faq"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="text-sm inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              GitHub
            </Link>
          </nav>

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
          </div>
        </div>
      </div>
      <Separator className="md:hidden" />
    </header>
  );
}
