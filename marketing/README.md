# Fastly - Modern SaaS Foundation

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![React Query](https://img.shields.io/badge/React%20Query-FF4154?logo=reactquery&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-0EA5E9?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-08090A?logo=shadcnui&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

## Overview

Fastly is a comprehensive SaaS foundation built with Next.js, TypeScript, and modern interface primitives. It delivers a cohesive marketing surface, secure authentication flows, and a scalable application shell for engineering teams who need to launch quickly without compromising quality.

## Core Capabilities

- Authentication flows with email/password, GitHub, and Google OAuth providers, backed by short-lived access tokens and refresh tokens.
- Account lifecycle tooling including profile management, avatar cropping, credential updates, session tracking, and account deletion safeguards.
- Developer-facing dashboard content that highlights account status, recent activity, and shortcuts to critical actions.
- Marketing surfaces with prebuilt hero, feature, FAQ, and footer sections designed for responsive layouts.
- Release communication pipeline featuring a tracing-beam changelog, release badges, and a JSON-driven data source for new announcements.
- File upload workflow powered by UploadThing alongside client-side image cropping utilities.

## Project Structure

This is a monorepo managed with pnpm workspaces:

- **Root (`/`)**: Marketing website with landing pages, docs, changelog, etc.
- **`main-app/`**: Starter kit SaaS application with authentication, dashboard, etc.

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run the marketing site (port 4000):

   ```bash
   pnpm dev:marketing
   ```

3. Run the starter kit app (port 3000):

   ```bash
   pnpm dev:app
   ```

4. Run both simultaneously:
   ```bash
   pnpm dev:all
   ```

## Available Scripts

- `pnpm dev:marketing` - Start marketing site in development
- `pnpm dev:app` - Start starter kit app in development
- `pnpm dev:all` - Start both apps concurrently
- `pnpm build:marketing` - Build marketing site for production
- `pnpm build:app` - Build starter kit app for production
- `pnpm lint:all` - Lint all workspaces
- `pnpm format:all` - Format code in all workspaces

## Technology Stack

- Next.js 14 App Router and React 19 written in TypeScript for modern SSR and client features.
- Tailwind CSS, shadcn/ui, and framer-motion for composable, accessible interface patterns.
- MongoDB with Mongoose for data persistence and schema management.
- TanStack Query with Axios for type-safe data fetching and caching.
- UploadThing integration for file handling, including avatar and document uploads.
- React Email with Nodemailer for onboarding and recovery workflows.

## Reference Links

- Website: [`Live App`](https://fastly.nabinkhair.com.np)
- Repository: [`GitHub`](https://github.com/nabinkhair42/fastly)
- Maintainer: [Nabin Khair](https://nabinkhair.com.np)
- Changelog: [`Changelog History`](https://fastly.nabinkhair.com.np/changelog)

---

Issues and pull requests are welcome. Please ensure linting and formatting checks pass before submitting changes.
