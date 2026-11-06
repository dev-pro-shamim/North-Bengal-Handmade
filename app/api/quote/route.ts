import { NextResponse } from 'next/server';

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
    console.log(`Item: ${productTitle} (${productSlug})`);
    console.log(`Spec: Size: ${selectedSize} | Color: ${selectedColor} | Brand: ${selectedBranding}`);
    console.log(`Buyer: ${buyerCompany} (${buyerName} - ${buyerEmail} / ${buyerPhone})`);
    console.log(`Term: ${incoterm} | Port: ${destination} | Qty: ${quantity}`);

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
