import { Card } from '@/components/ui/card';

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: 'Ava Thompson',
    role: 'Founder, DevLaunch',
    quote:
      'The starter covered auth, uploads, and emails—so we shipped our MVP in days.',
  },
  {
    name: 'Liam Patel',
    role: 'Full‑stack Engineer',
    quote:
      'Clean architecture and strong DX. It felt like starting on level ten.',
  },
  {
    name: 'Noah Williams',
    role: 'Indie Hacker',
    quote:
      'Everything just worked—dark mode, forms, validation. Huge time saver.',
  },
];

export default function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="testimonials-heading"
          className="text-3xl sm:text-4xl font-bold tracking-tight"
        >
          What builders say
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <Card key={t.name} className="p-5">
              <p className="text-sm text-muted-foreground">“{t.quote}”</p>
              <div className="mt-4">
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
