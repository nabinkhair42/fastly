import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { NextResponse, type NextRequest } from 'next/server';

export const revalidate = false;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const rawContent = await page.data.getText?.('raw');

  if (!rawContent) {
    notFound();
  }

  return new NextResponse(rawContent, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
