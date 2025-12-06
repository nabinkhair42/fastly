import { AppIconWithoutLink, DocsHeader } from '@/components/docs-header';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      nav={{
        title: (
          <>
            <AppIconWithoutLink />
          </>
        ),
        url: '/docs',
      }}
      tree={source.pageTree}
      sidebar={{
        defaultOpenLevel: 2,
        footer: null,
      }}
      themeSwitch={{
        enabled: false,
      }}
      links={[
        {
          text: 'Changelog',
          url: '/changelog',
        },
      ]}

    >
      <DocsHeader />
      {children}
    </DocsLayout>
  );
}
