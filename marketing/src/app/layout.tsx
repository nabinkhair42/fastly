import AppRootProvider from '@/providers/app-root-provider';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { metadata } from '@/seo/metadata';
import './globals.css';
export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppRootProvider>
          <RootProvider>{children}</RootProvider>
        </AppRootProvider>
      </body>
    </html>
  );
}
