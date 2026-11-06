import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/store';

// GET all products
export async function GET(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  const products = getProducts();
  return NextResponse.json({ success: true, count: products.length, products });
}

// POST create product
export async function POST(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, category, material, structure, image, moq, leadTime, compliance, origin } = body;

    if (!title || !category || !material) {
      return NextResponse.json(
        { error: 'Title, category, and material are required.' },
        { status: 400 }
      );
    }

    const newProduct = createProduct({
      itemNo: body.itemNo || `NB-EXP-${Math.floor(100 + Math.random() * 900)}`,
      title,
      category,
      material,
      structure: structure || 'Handcrafted Design',
      image: image || '/assets/products/kaisa-grass-deep-baskets.jpg',
      thumb: image || '/assets/products/kaisa-grass-deep-baskets.jpg',
      moq: moq || '300 - 500 pcs',
      leadTime: leadTime || '25-35 Days FOB Chittagong',
      compliance: compliance || 'Phytosanitary & Fumigation Certified',
      origin: origin || 'Kaunia, Rangpur & Dhaka, Bangladesh',
      featured: Boolean(body.featured)
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// PUT update product
export async function PUT(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const updated = updateProduct(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const deleted = deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Product not found or delete failed' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
