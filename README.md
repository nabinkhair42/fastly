<p align="center">
  <h1 align="center">Fastly</h1>
  <p align="center">A production-ready SaaS starter kit built with Next.js, TypeScript, and modern tooling.</p>
</p>

<p align="center">
  <a href="https://fastly.nabinkhair.com.np">Website</a> ·
  <a href="https://fastly.nabinkhair.com.np/docs">Documentation</a> ·
  <a href="https://create-fastly-app.nabinkhair.com.np">Live Demo</a> ·
  <a href="https://fastly.nabinkhair.com.np/changelog">Changelog</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-0EA5E9?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-08090A?logo=shadcnui&logoColor=white" alt="shadcn/ui" />
</p>

---

## Overview

Fastly is a comprehensive SaaS foundation that ships authentication, user management, file uploads, email workflows, and a polished marketing surface out of the box. It's designed for engineering teams who need to launch quickly without compromising on quality or security.

The project is structured as a **monorepo** with two independent Next.js applications:

| App | Description | Port | URL |
|-----|-------------|------|-----|
| **main-app** | SaaS starter kit with auth, dashboard, and API | 3000 | [create-fastly-app.nabinkhair.com.np](https://create-fastly-app.nabinkhair.com.np) |
| **marketing** | Marketing site, documentation, and changelog | 4000 | [fastly.nabinkhair.com.np](https://fastly.nabinkhair.com.np) |

---

## Features

### Authentication & Security
- Email/password authentication with verification codes
- GitHub and Google OAuth providers
- JWT access + refresh token rotation
- Cross-device session management with revocation
- Password reset and forgot password flows
- Mutex-based token refresh to prevent race conditions

### User Management
- User profiles with avatar upload and cropping
- Username claiming (one-time change)
- Location, social accounts, and bio fields
- Theme and font preferences
- Account deletion with confirmation

### Developer Experience
- Full TypeScript coverage with strict mode
- Biome for linting and formatting
- Husky + lint-staged for pre-commit hooks
- Turbopack for fast development builds
- TanStack Query for data fetching and caching
- Zod schemas for runtime validation
- React Hook Form for type-safe forms

### Marketing & Documentation
- Prebuilt landing page with hero, features, tech stack, and FAQ sections
- Fumadocs-powered documentation site with search and syntax highlighting
- JSON-driven changelog with tracing beam timeline
- SEO-optimized with OpenGraph and Twitter Card metadata
- LLM-friendly text endpoints (`/llms.txt`)

### Infrastructure
- MongoDB with Mongoose for data persistence
- UploadThing for file handling
- Nodemailer + React Email for transactional emails
- Vercel-optimized with `after()` for non-blocking post-response work
- Parallelized API routes with `Promise.all` for reduced latency

---

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16, React 19, TypeScript 5.9 |
| **Styling** | Tailwind CSS 4, tw-animate-css |
| **UI** | shadcn/ui, Radix UI, cmdk, Lucide Icons |
| **Forms** | React Hook Form, Zod, @hookform/resolvers |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT (jsonwebtoken), bcrypt, GitHub OAuth, Google OAuth |
| **Email** | Nodemailer, React Email |
| **Uploads** | UploadThing |
| **Data Fetching** | TanStack React Query, Axios |
| **Animation** | Motion (Framer Motion), Lenis |
| **Docs** | Fumadocs, Shiki, Mermaid |
| **Tooling** | Biome, Husky, lint-staged, Turbopack |

---


## Documentation

Comprehensive documentation is available at **[fastly.nabinkhair.com.np/docs](https://fastly.nabinkhair.com.np/docs)** covering:



## Deployment

Both apps are deployed on [Vercel](https://vercel.com) as separate projects.

### Main App

1. Import `main-app` directory as a new Vercel project
2. Set root directory to `main-app`
3. Add all environment variables from `.env.local`
4. Deploy

### Marketing Site

1. Import `marketing` directory as a new Vercel project
2. Set root directory to `marketing`
3. Deploy

---

## Scripts

### Main App

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm lint` | Run Biome linter |
| `pnpm format` | Format code with Biome |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm clean` | Remove `.next` build directory |

### Marketing

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm lint` | Run Biome linter |
| `pnpm format` | Format code with Biome |

---

## Contributing

Issues and pull requests are welcome. Please ensure linting and formatting checks pass before submitting changes:

```bash
pnpm lint
pnpm format:check
pnpm type-check
```

---

## Links

- **Website**: [fastly.nabinkhair.com.np](https://fastly.nabinkhair.com.np)
- **Live Demo**: [create-fastly-app.nabinkhair.com.np](https://create-fastly-app.nabinkhair.com.np)
- **Documentation**: [fastly.nabinkhair.com.np/docs](https://fastly.nabinkhair.com.np/docs)
- **Changelog**: [fastly.nabinkhair.com.np/changelog](https://fastly.nabinkhair.com.np/changelog)
- **Repository**: [github.com/nabinkhair42/fastly](https://github.com/nabinkhair42/fastly)
- **Author**: [Nabin Khair](https://nabinkhair.com.np)

---

## License

This project is open source. See the repository for license details.
