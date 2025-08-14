'use client';
import SettingSidebar from '@/app/(dashboard)/settings/components/settings-sidebar';
import { FloatingSidebarTrigger } from '@/components/ui/FloatingSidebarTrigger';
import { SidebarProvider } from '@/components/ui/sidebar';
interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <SettingSidebar />
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden bg-background">
        <div className="relative z-10 flex flex-1 flex-col min-w-0 max-w-6xl mx-left py-6">
          <FloatingSidebarTrigger />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
