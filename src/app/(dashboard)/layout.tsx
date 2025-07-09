'use client';

import ProtectedNavbar from '@/app/(dashboard)/components/protected-navbar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute redirectTo="/log-in">
      <ProtectedNavbar />
      {children}
    </ProtectedRoute>
  );
}
