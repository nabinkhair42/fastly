import { Link } from 'lucide-react';

export default function Footer() {
  return (
    <section className="bg-gradient-to-r py-32 from-black dark:via-emerald-800 to-black">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-title text-balance text-4xl font-semibold lg:text-5xl">
            Start Building your Product Today
          </h2>
          <p className="text-body mt-4">
            We are working on building basic infrastructure for your next SaaS
            app.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/" className="btn variant-primary sz-lg">
              <span>Get Started</span>
            </Link>
            <Link href="/" className="btn variant-outlined sz-lg">
              <span>Book Demo</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
