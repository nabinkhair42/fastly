"use client';";
import { DemoButton } from '@/components/buttons/demo-app';
import { GitHubButton } from '@/components/buttons/github-repo';
import { ModeSwitcher } from '@/components/buttons/mode-switcher';
import { Separator } from '@/components/ui/separator';
import { siteConfig } from '@/seo';
import Link from 'next/link';
import { GiCube } from 'react-icons/gi';

export const AppIcon = () => (
  <Link href="/" className="flex items-center space-x-2">
    <GiCube className="h-6 w-6" />
    <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
  </Link>
);

const NAV_LINKS = [
  {
    label: 'Docs',
    href: '/docs',
  },
  {
    label: 'Changelog',
    href: '/changelog',
  },
];

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-50">
      <div className="container-wrapper 3xl:fixed:px-0 px-4 xl:px-0 w-full max-w-5xl mx-auto">
        <div className="3xl:fixed:container flex h-14 items-center gap-2 **:data-[slot=separator]:!h-4">
          <AppIcon />

          <nav className="ml-0 hidden gap-6 sm:ml-6 sm:flex">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ModeSwitcher />
            <Separator orientation="vertical" className="hidden h-4 sm:inline-flex" />
            <DemoButton />
            <Separator orientation="vertical" className="hidden h-4 sm:inline-flex" />
            <GitHubButton />
          </div>
        </div>
      </div>
    </header>
  );
}
