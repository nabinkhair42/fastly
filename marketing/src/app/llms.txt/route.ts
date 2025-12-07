import { source } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const pages = source.getPages();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fastly.dev';

  // Group pages by category
  const gettingStarted = pages.filter((p) => p.url.includes('/getting-started'));
  const authentication = pages.filter((p) => p.url.includes('/authentication'));
  const apiReference = pages.filter((p) => p.url.includes('/api-reference'));
  const other = pages.filter(
    (p) =>
      !p.url.includes('/getting-started') &&
      !p.url.includes('/authentication') &&
      !p.url.includes('/api-reference')
  );

  const formatPage = (page: (typeof pages)[0]) => {
    const title = page.data.title;
    const description = page.data.description || '';
    return `- [${title}](${baseUrl}${page.url}): ${description}`;
  };

  const content = `# Fastly

> Fastly is a production-ready SaaS starter kit with authentication, user management, and session tracking. It is built with Next.js 16, TypeScript, MongoDB, and Tailwind CSS. It includes JWT-based authentication with access/refresh tokens, OAuth integration (GitHub, Google), email verification, session management, and more.

## Overview

${other.map(formatPage).join('\n')}

## Getting Started

${gettingStarted.map(formatPage).join('\n')}

## Authentication

${authentication.map(formatPage).join('\n')}

## API Reference

${apiReference.map(formatPage).join('\n')}
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
