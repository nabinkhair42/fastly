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
    <section className="relative overflow-hidden bg-white dark:bg-transparent">
      {/* Background Decorative Elements */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none isolate opacity-50 hidden lg:block"
      >
        <div className="absolute left-0 top-0 w-[35rem] h-[80rem] -translate-y-[87.5%] -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="absolute left-0 top-0 w-56 h-[80rem] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] translate-x-[5%] -translate-y-[50%]" />
        <div className="absolute left-0 top-0 w-56 h-[80rem] -translate-y-[87.5%] -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="pt-16 pb-8 sm:pt-24 sm:pb-12 lg:pt-32 lg:pb-16">
          {/* Hero Text Content */}
          <div className="mx-auto max-w-4xl text-center">
            <Reveal delay={0.1}>
              <div className="flex flex-col items-center space-y-6 sm:space-y-8">
                {/* Announcement */}
                <Announcement>
                  <AnnouncementTag>Latest update</AnnouncementTag>
                  <AnnouncementTitle>
                    Dashboard Updated
                    <ArrowUpRightIcon
                      className="ml-1 shrink-0 text-muted-foreground"
                      size={16}
                      aria-hidden="true"
                    />
                  </AnnouncementTitle>
                </Announcement>

                {/* Main Heading */}
                <h1
                  id="hero-heading"
                  className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                >
                  <span className="block text-gray-900 dark:text-white">
                    Build your SaaS
                  </span>
                  <span className="block mt-2">
                    <ContainerTextFlip
                      words={words}
                      interval={2500}
                      animationDuration={600}
                    />
                  </span>
                </h1>

                {/* Description */}
                <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Focus on building product features; not infrastructure. Start
                  on a secure, production‑ready foundation so you can ship
                  faster with confidence.
                </p>

                {/* CTA Button */}
                <div>
                  <Button size="lg" asChild className="text-base px-8 py-3">
                    <Link
                      href="/create-account"
                      aria-label="Get started free"
                      className="inline-flex items-center gap-2"
                    >
                      Create First SaaS App
                      <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Hero Image */}
          <div className="mx-auto mt-16 max-w-7xl [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]">
            <div className="[perspective:1200px] [mask-image:linear-gradient(to_right,black_50%,transparent_100%)] -mr-16 pl-16 lg:-mr-56 lg:pl-56">
              <Reveal delay={0.2}>
                <div className="[transform:rotateX(20deg);]">
                  <div className="lg:h-[44rem] relative skew-x-[.36rad]">
                    <Image
                      className="rounded-[4px] z-[2] relative border dark:hidden"
                      src="/demo/edit-profile-light.png"
                      alt="Tailark hero section"
                      width={2880}
                      height={2074}
                    />
                    <Image
                      className="rounded-[4px] z-[2] relative hidden border dark:block"
                      src="/demo/edit-profile-dark.png"
                      alt="Tailark hero section"
                      width={2880}
                      height={2074}
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
