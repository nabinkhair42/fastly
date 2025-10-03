import RootProvider from '@/providers/root-provider';
import { metadata } from '@/seo/metadata';
import { Viewport } from 'next';
import { Noto_Sans } from 'next/font/google';
import './globals.css';

const noto = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto',
  display: 'swap',
});

export { metadata };

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${noto.variable}`} suppressHydrationWarning>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
