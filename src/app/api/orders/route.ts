import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const { items, recipientName, recipientPhone, address } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "주문 항목이 필요합니다." },
      { status: 400 }
    );
  }

  if (!recipientName || !recipientPhone || !address) {
    return NextResponse.json(
      { error: "수령인 정보가 필요합니다." },
      { status: 400 }
    );
  }

  // Fetch all referenced products
  const productIds = items.map((item: { productId: number }) => Number(item.productId));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json(
      { error: "존재하지 않거나 비활성화된 상품이 포함되어 있습니다." },
      { status: 400 }
    );
  }

  // Build a price lookup map
  const productMap = new Map(products.map((p) => [p.id, p]));

  // Calculate total and validate stock
  let totalAmount = 0;
  const orderItemData: { productId: number; quantity: number; unitPrice: number }[] = [];

  for (const item of items) {
    const productId = Number(item.productId);
    const quantity = Number(item.quantity);
    const product = productMap.get(productId);

    if (!product) {
      return NextResponse.json(
        { error: `상품 ID ${productId}를 찾을 수 없습니다.` },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: "수량은 1 이상이어야 합니다." },
        { status: 400 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: `"${product.name}" 재고가 부족합니다. (현재 재고: ${product.stock})` },
        { status: 400 }
      );
    }

    const unitPrice = product.salePrice ?? product.price;
    totalAmount += unitPrice * quantity;

    orderItemData.push({
      productId,
      quantity,
      unitPrice,
    });
  }

  // Generate order number
  const orderNumber = "BTC-" + Date.now();

  // Create order with items in a transaction
  const order = await prisma.$transaction(async (tx) => {
    // Decrease stock for each product
    for (const item of orderItemData) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const newOrder = await tx.order.create({
      data: {
        userId: session.id,
        orderNumber,
        totalAmount,
        status: "pending",
        recipientName,
        recipientPhone,
        address,
        items: {
          create: orderItemData.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                thumbnailUrl: true,
              },
            },
          },
        },
      },
    });

    return newOrder;
  });

  return NextResponse.json(order, { status: 201 });
}

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              thumbnailUrl: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
