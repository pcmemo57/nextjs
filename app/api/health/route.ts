import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Next.js API başarıyla çalışıyor!",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
