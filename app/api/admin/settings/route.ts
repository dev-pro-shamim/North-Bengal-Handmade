import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getSettings, saveSettings } from '@/lib/store';

export async function GET(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  const settings = getSettings();
  return NextResponse.json({ success: true, settings });
}

export async function PUT(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const newSettings = await request.json();
    const saved = saveSettings(newSettings);

    if (!saved) {
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: newSettings });
  } catch (err: any) {
    return NextResponse.json({ error: 'Server error saving settings' }, { status: 500 });
  }
}
