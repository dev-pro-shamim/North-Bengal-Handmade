import { NextResponse } from 'next/server';
import { getSiteContent } from '@/lib/store';

export async function GET() {
  const content = getSiteContent();
  return NextResponse.json({ success: true, content });
}
