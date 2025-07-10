'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { useUserDetails } from '@/hooks/useUserMutations';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { createContext, useContext, useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import AuthProvider, { useAuth } from './AuthProvider';

// Simple font context
type FontContextType = {
  font: 'sans' | 'serif' | 'mono' | 'system';
  setFont: (font: 'sans' | 'serif' | 'mono' | 'system') => void;
};

const FontContext = createContext<FontContextType | undefined>(undefined);

export function useFont() {
  const ctx = useContext(FontContext);
  if (!ctx) throw new Error('useFont must be used within FontProvider');
  return ctx;
}

function FontProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { data: userDetails } = useUserDetails();
  const { setTheme } = useTheme();
  const [font, setFont] = useState<'sans' | 'serif' | 'mono' | 'system'>(
    'sans'
  );

  // Sync with database when user is authenticated and data is loaded
  useEffect(() => {
    if (isAuthenticated && userDetails?.data?.user?.preferences) {
      const dbPrefs = userDetails.data.user.preferences;

      // Update theme
      if (dbPrefs.theme) {
        setTheme(dbPrefs.theme);
      }

      // Update font
      if (dbPrefs.font) {
        setFont(dbPrefs.font as 'sans' | 'serif' | 'mono' | 'system');
      }
    }
  }, [isAuthenticated, userDetails, setTheme]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      <div className={font}>{children}</div>
    </FontContext.Provider>
  );
}

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <FontProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </FontProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
