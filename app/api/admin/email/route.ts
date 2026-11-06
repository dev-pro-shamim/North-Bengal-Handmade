import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { sendCustomerEmail } from '@/lib/email';
import { addInquiryReply } from '@/lib/store';

export async function POST(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { inquiryId, to, toName, subject, message, inquiryRef, productTitle } = body;

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Recipient email, subject, and message are required.' },
        { status: 400 }
      );
    }

    const emailResult = await sendCustomerEmail({
      to,
      toName: toName || 'International Buyer',
      subject,
      message,
      inquiryRef,
      productTitle
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.message },
        { status: 500 }
      );
    }

    // Record the communication in the inquiry thread
    if (inquiryId) {
      addInquiryReply(inquiryId, {
        sender: 'export@northbengalhandmade.com',
        subject,
        body: message
      });
    }

    return NextResponse.json({
      success: true,
      message: emailResult.message,
      simulated: emailResult.simulated
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Server error sending email' },
      { status: 500 }
    );
  }
}
