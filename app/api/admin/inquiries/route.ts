import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Server-only client (service role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

function isAdmin(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  return cookie.includes("oasis_admin=1");
}

function nowIso() {
  return new Date().toISOString();
}

/**
 * Expected columns on tenant_inquiries:
 * - status (text)
 * - is_archived (boolean)  ✅ you already added / confirmed it works
 * - deleted_at (timestamptz, nullable)  ✅ if you don’t have it, add it in Supabase
 */

export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const archived = searchParams.get("archived"); // "true" | "false" | null
  const limit = Math.min(parseInt(searchParams.get("limit") || "200", 10), 500);

  if (id) {
    const { data, error } = await supabase
      .from("tenant_inquiries")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("GET inquiry error", error);
      return NextResponse.json({ error: "Failed to fetch inquiry" }, { status: 500 });
    }
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ inquiry: data });
  }

  let q = supabase
    .from("tenant_inquiries")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (archived === "true") q = q.eq("is_archived", true);
  if (archived === "false") q = q.eq("is_archived", false);

  const { data, error } = await q;

  if (error) {
    console.error("GET inquiries error", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }

  return NextResponse.json({ inquiries: data ?? [] });
}

type PatchBody =
  | { action: "set_status"; ids: string[]; status: string }
  | { action: "archive"; ids: string[] }
  | { action: "unarchive"; ids: string[] }
  | { action: "delete"; ids: string[] } // only allowed if archived
  | {
      action: "quick_reply";
      id: string;
      template?: "thanks" | "viewing" | "application";
    };

export async function PATCH(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as PatchBody;

  // -------------------------
  // STATUS (bulk)
  // -------------------------
  if (body.action === "set_status") {
    const { ids, status } = body;
    if (!ids?.length) return NextResponse.json({ error: "Missing ids" }, { status: 400 });

    const { error } = await supabase
      .from("tenant_inquiries")
      .update({ status })
      .in("id", ids);

    if (error) {
      console.error("set_status error", error);
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  // -------------------------
  // ARCHIVE (bulk)
  // -------------------------
  if (body.action === "archive") {
    const { ids } = body;
    if (!ids?.length) return NextResponse.json({ error: "Missing ids" }, { status: 400 });

    const { error } = await supabase
      .from("tenant_inquiries")
      .update({ is_archived: true })
      .in("id", ids);

    if (error) {
      console.error("archive error", error);
      return NextResponse.json({ error: "Failed to archive" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  // -------------------------
  // UNARCHIVE (bulk)
  // -------------------------
  if (body.action === "unarchive") {
    const { ids } = body;
    if (!ids?.length) return NextResponse.json({ error: "Missing ids" }, { status: 400 });

    const { error } = await supabase
      .from("tenant_inquiries")
      .update({ is_archived: false })
      .in("id", ids);

    if (error) {
      console.error("unarchive error", error);
      return NextResponse.json({ error: "Failed to restore" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  // -------------------------
  // DELETE (bulk) — only if archived
  // Soft delete: sets deleted_at
  // -------------------------
  if (body.action === "delete") {
    const { ids } = body;
    if (!ids?.length) return NextResponse.json({ error: "Missing ids" }, { status: 400 });

    // Enforce: must already be archived
    const { data: rows, error: fetchErr } = await supabase
      .from("tenant_inquiries")
      .select("id,is_archived,deleted_at")
      .in("id", ids);

    if (fetchErr) {
      console.error("delete fetch error", fetchErr);
      return NextResponse.json({ error: "Failed to validate inquiries" }, { status: 500 });
    }

    const notArchived = (rows ?? []).filter((r: any) => !r.is_archived && !r.deleted_at);
    if (notArchived.length) {
      return NextResponse.json(
        { error: "Delete blocked. Archive first.", blocked_ids: notArchived.map((r: any) => r.id) },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("tenant_inquiries")
      .update({ deleted_at: nowIso() })
      .in("id", ids);

    if (error) {
      console.error("delete error", error);
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  // -------------------------
  // QUICK REPLY (single)
  // Also marks as contacted
  // -------------------------
  if (body.action === "quick_reply") {
    const { id, template = "thanks" } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const { data, error } = await supabase
      .from("tenant_inquiries")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      console.error("quick_reply fetch error", error);
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const toEmail = data.email as string | null;
    const fullName = (data.full_name as string | null) ?? "there";
    const propertyName = "831 Partington Ave";

    if (!toEmail) {
      return NextResponse.json({ error: "Inquiry has no email" }, { status: 400 });
    }

    let subject = "";
    let textBody = "";

    if (template === "viewing") {
      subject = `Viewing times for ${propertyName}`;
      textBody = `Hi ${fullName},

Thank you for your interest in ${propertyName}.

We’d be happy to arrange a viewing. Please reply with a few days/times that work for you over the next week, and we’ll confirm a slot.

Best regards,
Oasis International Real Estate Inc.`;
    } else if (template === "application") {
      subject = `Next steps for ${propertyName}`;
      textBody = `Hi ${fullName},

Thank you again for your interest in ${propertyName}.

To move forward, we’ll need a completed rental application and supporting documents (photo ID, proof of income, references). We’ll follow up with a secure link to submit everything.

Best regards,
Oasis International Real Estate Inc.`;
    } else {
      subject = `We received your inquiry about ${propertyName}`;
      textBody = `Hi ${fullName},

Thank you for your inquiry about ${propertyName}.

We’ve received your details and will follow up shortly with available viewing times and next steps.

Best regards,
Oasis International Real Estate Inc.`;
    }

    try {
      await resend.emails.send({
        from: "Oasis International Real Estate <notifications@oasisintlrealestate.com>",
        to: toEmail,
        subject,
        text: textBody,
        html: textBody.replace(/\n/g, "<br/>"),
      });
    } catch (err) {
      console.error("quick_reply email error", err);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    const { error: updateErr } = await supabase
      .from("tenant_inquiries")
      .update({ status: "contacted" })
      .eq("id", id);

    if (updateErr) {
      console.error("quick_reply status update error", updateErr);
      return NextResponse.json({ ok: true, warning: "Email sent but status update failed" });
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
