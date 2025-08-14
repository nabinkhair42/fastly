'use client';

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

export function FloatingSidebarTrigger() {
  const { state, isMobile } = useSidebar();

  const shouldShow = isMobile || state === 'collapsed';

  if (!shouldShow) return null;

  return (
    <div className="fixed top-4 left-4 z-50">
      <SidebarTrigger className="bg-background/95 backdrop-blur border rounded-lg p-2 shadow-lg hover:bg-accent transition-colors" />
    </div>
  );
}
