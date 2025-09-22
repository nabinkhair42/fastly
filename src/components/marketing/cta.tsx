import { Button } from '@/components/ui/button';
import { siteConfig } from '@/seo/metadata';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  return (
    <section aria-labelledby="cta-heading" className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border p-8 sm:p-12 text-center bg-card">
          <h2
            id="cta-heading"
            className="text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Everything you need to launch fast
          </h2>
          <p className="mt-3 text-muted-foreground">
            Skip month-long scaffolding. Start building the features your users
            actually pay for.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/create-account">
                Start free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
              >
                <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
