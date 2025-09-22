import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Braces,
  Database,
  KeyRound,
  MonitorSmartphone,
  ShieldCheck,
  UploadCloud,
  UserCog,
  Wrench,
} from 'lucide-react';

type Feature = {
  title: string;
  description: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const features: Feature[] = [
  {
    title: 'Secure authentication',
    description:
      'Email + OAuth (Google, GitHub), verification, and password reset flows included.',
    Icon: ShieldCheck,
  },
  {
    title: 'Profiles that feel premium',
    description:
      'Avatars, themes, fonts, social links, and one-time username change rules.',
    Icon: UserCog,
  },
  {
    title: 'Instant uploads',
    description:
      'Client-side cropping with server cleanup using UploadThing for avatars.',
    Icon: UploadCloud,
  },
  {
    title: 'Production APIs',
    description:
      'Zod-validated route handlers with consistent response helpers.',
    Icon: Braces,
  },
  {
    title: 'Type-safe data',
    description: 'MongoDB/Mongoose models for auth and user data.',
    Icon: Database,
  },
  {
    title: 'Token security',
    description:
      'Access/refresh JWTs with automatic rotation and protected routes.',
    Icon: KeyRound,
  },
  {
    title: 'Modern UI',
    description:
      'Tailwind + shadcn/ui + Radix with responsive layouts and dark mode.',
    Icon: MonitorSmartphone,
  },
  {
    title: 'Founder-grade DX',
    description:
      'TypeScript, TanStack Query, RHF, Axios, ESLint/Prettier, Vercel-ready.',
    Icon: Wrench,
  },
];

export default function FeatureGrid() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Badge variant="secondary">Core benefits</Badge>
          <h2
            id="features-heading"
            className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Everything you need to ship
          </h2>
          <p className="mt-2 text-muted-foreground">
            A complete foundation so you can focus on your product, not
            plumbing.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map(f => (
            <Card
              key={f.title}
              className="p-5 transition-colors hover:border-foreground/20"
            >
              <div className="flex items-start gap-3">
                <f.Icon
                  className="h-5 w-5 text-foreground/80"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
