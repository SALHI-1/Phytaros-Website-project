import { NextResponse } from "next/server";
import { SITE_CONFIG, getProductById } from "@/config/site";
import { sendPreorderEmails, type PricedPreorderItem } from "@/lib/emails";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { generateOrderId, preorderSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`preorder:${ip}`, 8, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error:
            "Too many pre-order attempts. Please wait a few minutes and try again.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSec) },
        }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const parsed = preorderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check your pre-order details and try again.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Merge quantities by productId and recompute all prices strictly on the server
    const qtyById = new Map<string, number>();
    for (const item of parsed.data.items) {
      const next = (qtyById.get(item.productId) ?? 0) + item.quantity;
      qtyById.set(
        item.productId,
        Math.min(next, SITE_CONFIG.preorder.maxQuantityPerItem)
      );
    }

    const pricedItems: PricedPreorderItem[] = [];
    for (const [productId, quantity] of qtyById.entries()) {
      const product = getProductById(productId);
      if (!product) {
        return NextResponse.json(
          { error: `Unknown product: ${productId}` },
          { status: 400 }
        );
      }
      pricedItems.push({
        product,
        quantity,
        lineTotalMad: product.priceMad * quantity,
      });
    }

    const totalMad = pricedItems.reduce(
      (sum, item) => sum + item.lineTotalMad,
      0
    );
    const orderId = generateOrderId();
    const estimatedDelivery = SITE_CONFIG.preorder.estimatedDelivery;

    const delivery = await sendPreorderEmails({
      orderId,
      items: pricedItems,
      totalMad,
      customer: parsed.data.customer,
      estimatedDelivery,
    });

    return NextResponse.json(
      {
        orderId,
        totalMad,
        estimatedDelivery,
        deliveryMode: delivery.mode,
        items: pricedItems.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          unitPriceMad: item.product.priceMad,
          lineTotalMad: item.lineTotalMad,
        })),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/preorder] Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Unable to process your pre-order right now. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
