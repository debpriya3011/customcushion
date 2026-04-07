import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, total, status, notes, shippingAddr, billingAddr, paymentMethod, deliveryCharge } = await req.json();

    // Store both addresses cleanly in the shippingAddr JSON field
    const addressData = shippingAddr ? {
      shipping: shippingAddr,
      billing: billingAddr ?? shippingAddr,
    } : undefined;

    const order = await prisma.order.create({
      data: {
        userId: session.id,
        items,
        total,
        status: status || 'PENDING',
        notes: notes || '',
        shippingAddr: addressData,
        paymentMethod: paymentMethod || 'COD',
        deliveryCharge: deliveryCharge || 0,
      }
    });

    try {
      const user = await prisma.user.findUnique({ where: { id: session.id } });
      const siteSettings = await prisma.setting.findMany({
        where: { key: { in: ['siteName', 'siteLogo'] } }
      });
      const siteName = siteSettings.find(s => s.key === 'siteName')?.value || 'CushionGuru';
      const siteLogo = siteSettings.find(s => s.key === 'siteLogo')?.value;

      if (user?.email) {
        const { sendMail } = await import('@/lib/mail');
        const { generateOrderConfirmationEmail } = await import('@/lib/email-templates');
        const emailHtml = generateOrderConfirmationEmail(order, siteName, siteLogo);
        await sendMail({
          to: user.email,
          subject: `Order Confirmation - ${siteName}`,
          html: emailHtml
        });
      }
    } catch (mailErr) {
      console.error('Failed to send order confirmation email:', mailErr);
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role === 'ADMIN') {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true }
      });
      return NextResponse.json(orders);
    } else {
      const orders = await prisma.order.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: 'desc' },
        include: { user: true }
      });
      return NextResponse.json(orders);
    }
  } catch (error: any) {
    console.error('Order fetching error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
