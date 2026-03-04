"use client";

import { useUserDetails } from "@/hooks/users/use-user-mutations";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Toaster } from "react-hot-toast";
import AuthProvider, { useAuth } from "./auth-provider";

type FontType = "sans" | "serif" | "mono" | "system";

interface FontContextType {
  font: FontType;
  setFont: (font: FontType) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export function useFont() {
  const ctx = useContext(FontContext);
  if (!ctx) {
    throw new Error("useFont must be used within FontProvider");
  }
  return ctx;
}

const TOASTER_OPTIONS = {
  position: "top-center" as const,
  toastOptions: {
    style: {
      background: "var(--sidebar)",
      color: "var(--sidebar-foreground)",
    },
  },
} as const;

const DEFAULT_FONT: FontType = "sans";

interface FontProviderProps {
  children: ReactNode;
}

function FontProvider({ children }: FontProviderProps) {
  const { isAuthenticated } = useAuth();
  const { data: userDetails } = useUserDetails();
  const { setTheme } = useTheme();
  const [font, setFont] = useState<FontType>(DEFAULT_FONT);

  // Extract primitive values for stable dependencies
  const userTheme = userDetails?.data?.user?.preferences?.theme;
  const userFont = userDetails?.data?.user?.preferences?.font;

  // Sync preferences with database
  useEffect(() => {
    if (isAuthenticated) {
      if (userTheme) {
        setTheme(userTheme);
      }

      if (userFont && ["sans", "serif", "mono", "system"].includes(userFont)) {
        setFont(userFont as FontType);
      }
    }
  }, [isAuthenticated, userTheme, userFont, setTheme]);

  const value = useMemo(() => ({ font, setFont }), [font]);

  return (
    <FontContext.Provider value={value}>
      <div className={font}>{children}</div>
    </FontContext.Provider>
  );
}

interface RootProviderProps {
  children: ReactNode;
}

export default function RootProvider({ children }: RootProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
        >
          <FontProvider>
            {children}
            <Toaster {...TOASTER_OPTIONS} />
          </FontProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
