'use client';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/seo/metadata';
import { ArrowRight, LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl font-bold tracking-tight"
            >
              Build SaaS 5x faster with a production‑ready starter kit
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Launch with secure auth, polished UI, file uploads, and email
              flows — all wired to a type‑safe Next.js backend.
            </p>
            <p className="mt-3 text-base text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/create-account" aria-label="Get started free">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/log-in" aria-label="Log in">
                  <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
                  Log in
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border bg-muted">
            <Image
              src="/og-image.webp"
              alt="Product preview of the Next Gen – SaaS Starter Kit"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
