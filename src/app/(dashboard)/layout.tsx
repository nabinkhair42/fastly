'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute redirectTo="/log-in">{children}</ProtectedRoute>;
}
