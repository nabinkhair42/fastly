'use client';

import { Button } from '@/components/ui/button';
import { ContainerTextFlip } from '@/components/ui/text-flip';
import { ArrowUpRight, ArrowUpRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
} from '../ui/announcement-tag';
import Reveal from './reveal';

const words = ['5x faster.', 'more secure.', 'ship faster.', 'confidence.'];

export default function Hero() {
  return (
    <section className="relative h-screen" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-7xl px-4 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div className="rounded-2xl flex flex-col space-y-4">
              <Announcement>
                <AnnouncementTag>Latest update</AnnouncementTag>
                <AnnouncementTitle>
                  Dashboard Updated
                  <ArrowUpRightIcon
                    className="shrink-0 text-muted-foreground"
                    size={16}
                  />
                </AnnouncementTitle>
              </Announcement>

              <h1
                id="hero-heading"
                className="text-4xl md:text-5xl font-bold flex flex-col gap-2"
              >
                Build your SaaS
                <ContainerTextFlip
                  words={words}
                  interval={2500}
                  animationDuration={600}
                />
              </h1>
              <p className="mt-3 text-base text-muted-foreground">
                Focus on building product features; not infrastructure. Start on
                a secure, production‑ready foundation so you can ship faster
                with confidence.
              </p>
              <div>
                <Button asChild>
                  <Link href="/create-account" aria-label="Get started free">
                    Create First SaaS App
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="p-4">
            <Image
              src="/demo/edit-app.png"
              alt="Product preview of the Next Gen – Fastly Kit"
              className="h-[90vh] border rounded object-cover"
              width={1000}
              height={900}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
