'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'What’s included?',
    a: 'Auth (email + OAuth), profiles, uploads, emails, Zod APIs, JWT, MongoDB, and a polished UI.',
  },
  {
    q: 'Does it support OAuth?',
    a: 'Yes—Google and GitHub are wired with an email/password flow and verification.',
  },
  {
    q: 'How are tokens handled?',
    a: 'Short‑lived access tokens with refresh rotation and route protection.',
  },
  {
    q: 'Can I deploy to Vercel?',
    a: 'Yes. The project is optimized for Vercel with environment variables and edge‑ready patterns.',
  },
  {
    q: 'Can I customize the UI?',
    a: 'Absolutely. Tailwind + shadcn/ui + Radix components are easy to theme and extend.',
  },
  {
    q: 'Is there a database?',
    a: 'MongoDB via Mongoose models for users and auth data.',
  },
] as const;

export default function FAQ() {
  return (
    <section aria-labelledby="faq-heading" className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 lg:px-0">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4">
            Here are some common questions about the product.
          </p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="mt-6 [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)] pb-6"
        >
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
