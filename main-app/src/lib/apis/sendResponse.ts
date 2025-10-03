import { NextResponse } from 'next/server';

export const sendResponse = (message: string, status: number, data?: unknown, error?: unknown) => {
  if (error) {
    // Log the detailed error server-side but avoid leaking implementation details to clients
    console.error('[API Error]', error);
  }

  return NextResponse.json({ message, data }, { status });
};
