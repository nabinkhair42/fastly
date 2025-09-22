'use client';

import type { PropsWithChildren } from 'react';

type PageShellProps = PropsWithChildren<{
  className?: string;
}>;

export default function PageShell({ children, className }: PageShellProps) {
  return <div className={className}>{children}</div>;
}
