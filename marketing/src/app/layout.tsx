import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import AppRootProvider from "@/providers/app-root-provider";
import { metadata } from "@/seo/metadata";
import "./globals.css";
export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <AppRootProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </AppRootProvider>
      </body>
    </html>
  );
}
