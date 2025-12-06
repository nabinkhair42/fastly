import AppRootProvider from '@/providers/app-root-provider';
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
        <AppRootProvider>{children}</AppRootProvider>
      </body>
    </html>
  );
}
