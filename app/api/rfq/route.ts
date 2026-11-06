import { NextResponse } from 'next/server';
import { addInquiry } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, category, destination, quantity, incoterm, notes } = body;

    if (!name || !email || !company) {
      return NextResponse.json(
        { error: 'Name, company, and email are required fields.' },
        { status: 400 }
      );
    }

    const rfqReference = `RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    console.log(`[RFQ SUBMITTED] Ref: ${rfqReference} from ${company} (${name} - ${email})`);

    // Persist to store for Admin Dashboard
    addInquiry({
      reference: rfqReference,
      type: 'rfq',
      status: 'new',
      customer: {
        name,
        company,
        email,
        phone: phone || '',
      },
      details: {
        product: category,
        quantity: quantity || 'Standard Container Batch',
        incoterm: incoterm || 'FOB Chittagong (BDCGP)',
        destination: destination || '',
        notes: notes || ''
      }
    });

    return NextResponse.json({
      success: true,
      reference: rfqReference,
      message: 'Your RFQ requisition has been registered with our commercial export desk.',
      estimatedResponseTime: 'Within 12 business hours',
      details: {
        company,
        category,
        quantity,
        destination,
        incoterm: incoterm || 'FOB Chittagong (BDCGP)',
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected server error occurred processing your quotation.' },
      { status: 500 }
    );
  }
}
