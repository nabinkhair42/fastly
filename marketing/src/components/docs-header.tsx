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
    <span className="hidden font-medium sm:inline-block">{siteConfig.name}</span>
  </Link>
);

export const AppIconWithoutLink = () => (
  <div className="flex items-center space-x-2">
    <GiCube className="h-6 w-6" />
    <span className="hidden font-medium sm:inline-block">{siteConfig.name}</span>
  </div>
);

export function DocsHeader() {
  return (
    <header className="bg-background sticky top-0 z-40">
      <div className="container-wrapper 3xl:fixed:px-0 px-4 xl:px-0 w-full max-w-5xl mx-auto">
      <div className="3xl:fixed:container flex h-14 items-center gap-2 **:data-[slot=separator]:!h-4">
          <div className="ml-auto hidden lg:flex items-center gap-2">
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
