import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getSiteContent, saveSiteContent } from '@/lib/store';

// GET site content
export async function GET() {
  const content = getSiteContent();
  return NextResponse.json({ success: true, content });
}

// PUT update site content
export async function PUT(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const updatedContent = await request.json();
    const saved = saveSiteContent(updatedContent);

    if (!saved) {
      return NextResponse.json({ error: 'Failed to save site content' }, { status: 500 });
    }

    return NextResponse.json({ success: true, content: updatedContent });
  } catch (err: any) {
    return NextResponse.json({ error: 'Error updating content' }, { status: 500 });
  }
}
