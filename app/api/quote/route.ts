import { NextResponse } from 'next/server';
import { addInquiry } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productTitle,
      productSlug,
      selectedSize,
      selectedColor,
      selectedBranding,
      quantity,
      incoterm,
      destination,
      buyerName,
      buyerCompany,
      buyerEmail,
      buyerPhone,
      specialNotes
    } = body;

    if (!buyerName || !buyerCompany || !buyerEmail || !quantity) {
      return NextResponse.json(
        { error: 'Buyer name, company, email, and target quantity are required.' },
        { status: 400 }
      );
    }

    const quoteRef = `CQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    console.log(`[CUSTOM PRODUCT QUOTE DISPATCHED] Ref: ${quoteRef}`);

    // Persist to store for Admin Dashboard
    addInquiry({
      reference: quoteRef,
      type: 'custom_quote',
      status: 'new',
      customer: {
        name: buyerName,
        company: buyerCompany,
        email: buyerEmail,
        phone: buyerPhone || '',
      },
      details: {
        product: `${productTitle} (${selectedSize || 'Standard'} / ${selectedColor || 'Natural'})`,
        quantity: String(quantity),
        incoterm: incoterm || 'FOB Chittagong (BDCGP)',
        destination: destination || '',
        notes: `Branding: ${selectedBranding || 'None'} | Notes: ${specialNotes || 'None'}`
      }
    });

    return NextResponse.json({
      success: true,
      reference: quoteRef,
      message: `Your customized export quotation request for ${productTitle} has been received by our commercial export desk.`,
      estimatedResponseTime: 'Within 12 business hours',
      quoteSummary: {
        product: productTitle,
        size: selectedSize,
        color: selectedColor,
        branding: selectedBranding,
        quantity,
        incoterm,
        destination
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while registering your custom quote.' },
      { status: 500 }
    );
  }
}
