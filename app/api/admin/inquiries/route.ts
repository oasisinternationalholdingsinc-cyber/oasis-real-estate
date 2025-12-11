// app/api/admin/inquiries/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function requireAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get("oasis_admin");
  return !!cookie && cookie.value === "1";
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, serviceKey);
}

// GET → list latest inquiries
export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("tenant_inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Error loading tenant_inquiries", error);
    return NextResponse.json(
      { ok: false, error: "Failed to load inquiries" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, inquiries: data ?? [] });
}

// PATCH → update status
export async function PATCH(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const body = await req.json();
  const { id, status } = body as { id?: string; status?: string };

  if (!id || !status) {
    return NextResponse.json(
      { ok: false, error: "Missing id or status" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("tenant_inquiries")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating inquiry status", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update status" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, inquiry: data });
}
