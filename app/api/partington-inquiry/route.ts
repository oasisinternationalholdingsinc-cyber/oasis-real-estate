import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    console.log("New Partington inquiry:", data);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("partington-inquiry error:", err);
    return NextResponse.json({ ok: false, error: "Failed to submit inquiry" }, { status: 500 });
  }
}
