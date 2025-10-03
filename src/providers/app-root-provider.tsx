'use client';

import { ThemeProvider } from '@/providers/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function AppRootProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--sidebar)',
              color: 'var(--sidebar-foreground)',
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
