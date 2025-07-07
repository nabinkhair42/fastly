import { NextResponse } from 'next/server';

export const sendResponse = (
  message: string,
  status: number,
  data?: unknown,
  error?: unknown
) => {
  return NextResponse.json({ message, data, error }, { status });
};
