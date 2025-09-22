'use client';

import { AppSidebar } from '@/app/(protected)/components/app-sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FloatingSidebarTrigger } from '@/components/ui/FloatingSidebarTrigger';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute redirectTo="/log-in">
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden bg-background">
          <div className="relative z-10 flex flex-1 flex-col min-w-0 max-w-6xl mx-left py-6">
            <FloatingSidebarTrigger />
            {children}
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
