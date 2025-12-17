// app/api/admin/inquiries/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

function isAdmin(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  return cookie.includes("oasis_admin=1");
}

function noStoreJson(body: any, init?: ResponseInit) {
  const res = NextResponse.json(body, init);
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

async function logMessage(args: {
  inquiry_id: string;
  direction: "inbound" | "outbound";
  channel: "form" | "email";
  sender_type: "tenant" | "oasis" | "system";
  body_text: string;
  subject?: string | null;
  from_email?: string | null;
  to_email?: string | null;
  provider?: string | null;
  provider_message_id?: string | null;
  delivery_status?: string | null;
  meta?: any;
}) {
  const { error } = await supabase.from("inquiry_messages").insert({
    inquiry_id: args.inquiry_id,
    direction: args.direction,
    channel: args.channel,
    sender_type: args.sender_type,
    body_text: args.body_text,
    subject: args.subject ?? null,
    from_email: args.from_email ?? null,
    to_email: args.to_email ?? null,
    provider: args.provider ?? null,
    provider_message_id: args.provider_message_id ?? null,
    delivery_status: args.delivery_status ?? null,
    meta: args.meta ?? null,
  });

  if (error) throw new Error("Failed to log message");
}

export async function GET(req: Request) {
  if (!isAdmin(req)) return noStoreJson({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const archived = searchParams.get("archived"); // "true" | "false" | null
  const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10) || 100, 500);

  if (id) {
    const { data: inquiry, error } = await supabase
      .from("tenant_inquiries")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) return noStoreJson({ error: "Failed to fetch inquiry" }, { status: 500 });
    if (!inquiry) return noStoreJson({ error: "Not found" }, { status: 404 });

    const { data: messages, error: msgErr } = await supabase
      .from("inquiry_messages")
      .select("*")
      .eq("inquiry_id", id)
      .order("created_at", { ascending: true });

    if (msgErr) return noStoreJson({ error: "Failed to fetch messages" }, { status: 500 });

    return noStoreJson({ inquiry, messages: messages ?? [] });
  }

  let q = supabase
    .from("tenant_inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (archived === "true") q = q.eq("is_archived", true).is("deleted_at", null);
  if (archived === "false") q = q.eq("is_archived", false).is("deleted_at", null);

  const { data, error } = await q;
  if (error) return noStoreJson({ error: "Failed to fetch inquiries" }, { status: 500 });

  return noStoreJson({ inquiries: data ?? [] });
}

export async function PATCH(req: Request) {
  if (!isAdmin(req)) return noStoreJson({ error: "Unauthorized" }, { status: 401 });

  const raw = await req.json().catch(() => null);
  if (!raw || typeof raw !== "object") return noStoreJson({ error: "Invalid JSON" }, { status: 400 });

  const action = (raw as any).action as string | undefined;

  // Legacy single update (no action)
  if (!action && (raw as any).id && (raw as any).status) {
    const { error } = await supabase
      .from("tenant_inquiries")
      .update({ status: (raw as any).status })
      .eq("id", (raw as any).id);

    if (error) return noStoreJson({ error: "Failed to update status" }, { status: 500 });
    return noStoreJson({ ok: true });
  }

  // Bulk set status
  if (action === "set_status") {
    const ids = (raw as any).ids as string[] | undefined;
    const status = (raw as any).status as string | undefined;
    if (!ids?.length) return noStoreJson({ error: "Missing ids" }, { status: 400 });
    if (!status) return noStoreJson({ error: "Missing status" }, { status: 400 });

    const { error } = await supabase.from("tenant_inquiries").update({ status }).in("id", ids);
    if (error) return noStoreJson({ error: "Failed to update status" }, { status: 500 });

    return noStoreJson({ ok: true });
  }

  // Archive / unarchive / delete (same as your working version)
  if (action === "archive" || action === "unarchive" || action === "delete") {
    const ids = (raw as any).ids as string[] | undefined;
    if (!ids?.length) return noStoreJson({ error: "Missing ids" }, { status: 400 });

    if (action === "archive") {
      const { error } = await supabase
        .from("tenant_inquiries")
        .update({ is_archived: true, archived_at: new Date().toISOString() })
        .in("id", ids);
      if (error) return noStoreJson({ error: "Failed to archive" }, { status: 500 });
      return noStoreJson({ ok: true });
    }

    if (action === "unarchive") {
      const { error } = await supabase
        .from("tenant_inquiries")
        .update({ is_archived: false, archived_at: null })
        .in("id", ids);
      if (error) return noStoreJson({ error: "Failed to unarchive" }, { status: 500 });
      return noStoreJson({ ok: true });
    }

    // soft delete (only archived)
    const { error } = await supabase
      .from("tenant_inquiries")
      .update({ deleted_at: new Date().toISOString() })
      .in("id", ids)
      .eq("is_archived", true);

    if (error) return noStoreJson({ error: "Failed to delete" }, { status: 500 });
    return noStoreJson({ ok: true });
  }

  // ✅ Internal notes
  if (action === "set_notes") {
    const id = (raw as any).id as string | undefined;
    const notes = (raw as any).notes as string | undefined;
    if (!id) return noStoreJson({ error: "Missing id" }, { status: 400 });

    const { error } = await supabase
      .from("tenant_inquiries")
      .update({ internal_notes: notes ?? "" })
      .eq("id", id);

    if (error) return noStoreJson({ error: "Failed to update notes" }, { status: 500 });
    return noStoreJson({ ok: true });
  }

  // ✅ Reply from dashboard → send + log
  if (action === "reply") {
    const id = (raw as any).id as string | undefined;
    const subject = ((raw as any).subject as string | undefined) ?? "";
    const body = ((raw as any).body as string | undefined) ?? "";
    if (!id) return noStoreJson({ error: "Missing id" }, { status: 400 });
    if (!body.trim()) return noStoreJson({ error: "Message is empty" }, { status: 400 });

    const { data: inquiry, error } = await supabase
      .from("tenant_inquiries")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !inquiry) return noStoreJson({ error: "Inquiry not found" }, { status: 404 });

    const toEmail = (inquiry.email as string | null) ?? null;
    if (!toEmail) return noStoreJson({ error: "Inquiry has no email address" }, { status: 400 });

    const fromEmail = "Oasis International Real Estate <notifications@oasisintlrealestate.com>";
    const cleanSubject =
      subject.trim() ||
      `Re: ${String(inquiry.property_slug ?? "Inquiry")} — Oasis International Real Estate`;

    let providerMessageId: string | null = null;

    try {
      const sent = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: cleanSubject,
        text: body,
        html: body.replace(/\n/g, "<br/>"),
      });

      // Resend returns an id (best-effort)
      providerMessageId = (sent as any)?.data?.id ?? (sent as any)?.id ?? null;

      await logMessage({
        inquiry_id: id,
        direction: "outbound",
        channel: "email",
        sender_type: "oasis",
        subject: cleanSubject,
        body_text: body,
        from_email: "notifications@oasisintlrealestate.com",
        to_email: toEmail,
        provider: "resend",
        provider_message_id: providerMessageId,
        delivery_status: "sent",
        meta: { source: "dashboard" },
      });
    } catch (e) {
      // If send fails, still optionally log attempt (your call).
      return noStoreJson({ error: "Failed to send email" }, { status: 500 });
    }

    // Optional: bump status to contacted if still new
    if (String(inquiry.status || "").toLowerCase() === "new") {
      await supabase.from("tenant_inquiries").update({ status: "contacted" }).eq("id", id);
    }

    return noStoreJson({ ok: true, provider_message_id: providerMessageId });
  }

  return noStoreJson({ error: "Unsupported action/payload" }, { status: 400 });
}
