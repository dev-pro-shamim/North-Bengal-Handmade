import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, subject } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

    return NextResponse.json({
      success: true,
      ticketId,
      message: 'Thank you for reaching out to North Bengal Handmade Products BD. We will be in touch shortly.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error processing contact message.' },
      { status: 500 }
    );
  }
}
