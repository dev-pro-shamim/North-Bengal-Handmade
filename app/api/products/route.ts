import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/store';

export async function GET() {
  const products = getProducts();
  return NextResponse.json({ success: true, count: products.length, products });
}
