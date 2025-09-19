import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import {
  generateOrganizationStructuredData,
  generateWebApplicationStructuredData,
  generateWebsiteStructuredData,
} from '@/seo/seo';
import Link from 'next/link';

const page = () => {
  const websiteStructuredData = generateWebsiteStructuredData();
  const organizationStructuredData = generateOrganizationStructuredData();
  const webAppStructuredData = generateWebApplicationStructuredData();

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webAppStructuredData),
        }}
      />

      <div className="flex flex-col items-center justify-center h-[100svh]">
        <div className="text-center mb-8">
          <Logo
            width={80}
            height={80}
            variant="colored"
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold mb-2">Welcome to SaaS Starter</h1>
          <p className="text-lg text-muted-foreground">
            Modern SaaS foundation built with Next.js & TypeScript
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/log-in">Log in</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/create-account">Create account</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default page;
