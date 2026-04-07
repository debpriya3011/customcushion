import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { uploadToS3, deleteFromS3 } from '@/lib/s3';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const sku = formData.get('sku') as string;
    const description = formData.get('description') as string;
    const lpStr = formData.get('listingPrice') as string;
    const spStr = formData.get('sellingPrice') as string;
    const file = formData.get('image') as File | null;

    if (!name || !sku || !description || !lpStr || !spStr) {
      return NextResponse.json({ error: 'Name, SKU, Description, and Prices are required' }, { status: 400 });
    }

    const listingPrice = parseFloat(lpStr);
    const sellingPrice = parseFloat(spStr);

    let updateData: any = {
      name,
      sku,
      description,
      listingPrice,
      sellingPrice,
    };

    const existingProduct = await prisma.product.findUnique({ where: { id: resolvedParams.id } });

    if (file && file.size > 0) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `products/prod_${slug}_${Date.now()}.${ext}`;
      
      const newUrl = await uploadToS3(buffer, filename, file.type || 'image/jpeg');
      updateData.imageUrl = newUrl;

      // Delete old image if it's an S3 URL
      if (existingProduct?.imageUrl && existingProduct.imageUrl.includes('amazonaws.com')) {
        await deleteFromS3(existingProduct.imageUrl);
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: resolvedParams.id },
      data: updateData,
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error('Product update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const existingProduct = await prisma.product.findUnique({ where: { id: resolvedParams.id } });
    
    if (existingProduct?.imageUrl && existingProduct.imageUrl.includes('amazonaws.com')) {
      await deleteFromS3(existingProduct.imageUrl);
    }

    await prisma.product.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
