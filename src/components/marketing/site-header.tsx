'use client';

import { Separator } from '@/components/ui/separator';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { siteConfig } from '@/seo/metadata';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GiCube } from 'react-icons/gi';
import { Button } from '../ui/button';

export default function SiteHeader() {
  const router = useRouter();
  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      aria-label="Site header"
    >
      <div className="mx-auto max-w-5xl px-4 lg:px-0">
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

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push('/create-account')}
            >
              Demo App
              <ArrowUpRight />
            </Button>
          </div>
        </div>
      </div>
      <Separator className="md:hidden" />
    </header>
  );
}
