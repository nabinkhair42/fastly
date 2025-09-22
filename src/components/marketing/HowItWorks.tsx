import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle2, MailCheck, Settings, UserPlus } from 'lucide-react';

type Step = {
  title: string;
  description: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const steps: Step[] = [
  {
    title: 'Create account',
    description: 'Start free in seconds.',
    Icon: UserPlus,
  },
  {
    title: 'Verify email',
    description: 'Secure your workspace.',
    Icon: MailCheck,
  },
  {
    title: 'Personalize profile',
    description: 'Avatar, theme, and details.',
    Icon: Settings,
  },
  {
    title: 'Build your app',
    description: 'Ship features users love.',
    Icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Badge variant="secondary">How it works</Badge>
          <h2
            id="how-heading"
            className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight"
          >
            From zero to shipping
          </h2>
          <p className="mt-2 text-muted-foreground">
            A straightforward path to launch.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <Card key={s.title} className="p-5">
              <div className="flex items-start gap-3">
                <s.Icon
                  className="h-5 w-5 text-foreground/80"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Step {idx + 1}
                  </p>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {s.description}
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
