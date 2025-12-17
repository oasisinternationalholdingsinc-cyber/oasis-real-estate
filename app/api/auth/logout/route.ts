// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.redirect(new URL("/login", "http://localhost"), 302);

  // If you later set auth cookies, clear them here:
  res.cookies.set("sb-access-token", "", { path: "/", expires: new Date(0) });
  res.cookies.set("sb-refresh-token", "", { path: "/", expires: new Date(0) });

  return res;
}
