This is a [Fastly](https://starter.nabinkhair.com.np) SaaS starter kit bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Authentication**: Complete auth system with login, signup, email verification, and password reset
- **User Management**: User profiles, account settings, and session management
- **Email Templates**: Beautiful email templates built with React Email
- **Modern UI**: Built with shadcn/ui, Tailwind CSS, and Radix UI components
- **Responsive Design**: Mobile-first design that works on all devices
- **SEO Optimized**: Built-in SEO configuration and metadata management
- **File Uploads**: Integrated file upload functionality with UploadThing
- **Database**: MongoDB integration with Mongoose
- **Type Safety**: Full TypeScript support throughout the application
- **Performance**: Optimized with Next.js 15 and Turbopack

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

```
├── app/                 # Next.js App Router pages
│   ├── (auth)/         # Authentication pages
│   ├── (protected)/    # Protected user pages
│   ├── api/            # API routes
│   └── globals.css     # Global styles
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   └── marketing/     # Marketing page components
├── lib/               # Utility functions and configurations
├── models/            # Database models
├── services/          # Business logic services
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── zod/               # Validation schemas
└── mail-templates/    # Email templates
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [shadcn/ui](https://ui.shadcn.com) - modern UI components built on Radix UI.
- [Tailwind CSS](https://tailwindcss.com) - utility-first CSS framework.
- [React Email](https://react.email) - modern email templates with React.
- [MongoDB](https://docs.mongodb.com) - NoSQL database documentation.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
