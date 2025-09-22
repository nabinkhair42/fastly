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
    <section id="faq" aria-labelledby="faq-heading" className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2
          id="faq-heading"
          className="text-3xl sm:text-4xl font-bold tracking-tight"
        >
          FAQ
        </h2>
        <Accordion type="single" collapsible className="mt-6">
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
