// app/api/inquiries/reply/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVER_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  try {
    const { inquiry_id, message } = (await req.json()) as {
      inquiry_id?: string;
      message?: string;
    };

    if (!inquiry_id || !message?.trim()) {
      return NextResponse.json(
        { error: "Missing inquiry_id or message." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Try the same table candidates your thread reader uses
    const candidates = ["tenant_inquiry_messages", "inquiry_messages", "messages"];

    let lastErr: any = null;

    for (const table of candidates) {
      const { error } = await supabase.from(table).insert({
        inquiry_id,
        role: "owner",
        content: message.trim(),
      });

      if (!error) {
        return NextResponse.json({ ok: true, table });
      }

      lastErr = error;
    }

    return NextResponse.json(
      { error: lastErr?.message || "No messages table matched for insert." },
      { status: 500 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unknown error." },
      { status: 500 }
    );
  }
}
