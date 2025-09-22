import { siteConfig } from '@/seo/metadata';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  const author = siteConfig.authors?.[0]?.name || 'Author';

  return (
    <footer className="border-t" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            © {year} {author}. All rights reserved.
          </p>
          <nav className="flex items-center gap-6 text-sm" aria-label="Footer">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
