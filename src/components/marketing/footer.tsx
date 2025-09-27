import Link from 'next/link';
import { FaXTwitter } from 'react-icons/fa6';
import { SiGithub } from 'react-icons/si';

export default function Footer() {
  return (
    <section className="bg-gradient-to-r py-32 ">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center flex flex-col gap-6">
          <h2 className="text-title text-tracking-tight text-4xl font-semibold lg:text-5xl">
            Start Building your Product Today
          </h2>
          <p className="text-body mt-4">
            We are working on building basic infrastructure for your next SaaS
            app.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="https://github.com/nabinkhair42/saas-starter"
              target="_blank"
            >
              <SiGithub />
            </Link>
            <Link href="https://x.com/khairnabin">
              <FaXTwitter />
            </Link>
          </div>
          <Link
            href="/changelog"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Changelog
          </Link>
        </div>
      </div>
    </section>
  );
}
