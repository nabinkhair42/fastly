"use client";

import { Suspense } from "react";

import { AppSidebar } from "@/app/(protected)/components/app-sidebar";
import ProtectedRoute from "@/components/auth/protected-route";
import { ErrorBoundary } from "@/components/error-boundary";
import ScreenLoader from "@/components/screen-loader";
import { SidebarProvider } from "@/components/ui/sidebar";
import TopNavbar from "./components/top-navbar";

export default function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ProtectedRoute fallback={<ScreenLoader />}>
        <ErrorBoundary>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <div className="flex flex-col w-full border-l rounded-l-2xl">
              <TopNavbar />
              <div className="p-4 max-w-6xl mx-left">{children}</div>
            </div>
          </SidebarProvider>
        </ErrorBoundary>
      </ProtectedRoute>
    </Suspense>
  );
}
