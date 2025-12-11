// app/api/admin/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const ADMIN_EMAIL = process.env.ADMIN_DASH_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_DASH_PASSWORD;

  // Simple email/password check (you can drop email if you want)
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });

    // 👇 this MUST match your middleware:
    // cookie name: "oasis_admin"
    // value: "1"
    res.cookies.set("oasis_admin", "1", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
    });

    return res;
  }

  return NextResponse.json(
    { ok: false, error: "Invalid credentials" },
    { status: 401 }
  );
}
