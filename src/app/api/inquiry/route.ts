import { NextResponse } from "next/server";
import { sendInquiryEmail } from "@/lib/emails";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { inquirySchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`inquiry:${ip}`, 10, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a few minutes." },
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

    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check the highlighted fields.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const delivery = await sendInquiryEmail(parsed.data);

    return NextResponse.json(
      { ok: true, deliveryMode: delivery.mode },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/inquiry] Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Unable to send your message right now.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
