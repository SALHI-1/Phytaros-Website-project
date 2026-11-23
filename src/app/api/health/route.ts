import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "phytaros-web",
    timestamp: new Date().toISOString(),
  });
}
