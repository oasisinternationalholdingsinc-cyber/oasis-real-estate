import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  if (!cookie.includes("oasis_admin=1")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.inquiry_id || !body.message) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Forward to the real admin endpoint
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/admin/inquiries`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie, // forward admin cookie
      },
      body: JSON.stringify({
        action: "reply",
        id: body.inquiry_id,
        body: body.message,
      }),
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
