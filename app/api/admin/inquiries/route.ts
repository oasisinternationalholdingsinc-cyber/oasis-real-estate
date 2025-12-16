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

/** -------------------- Types + guards (fixes TS build) -------------------- */

type BulkSetStatusPayload = { action: "set_status"; ids: string[]; status: string };
type ArchivePayload = { action: "archive"; ids: string[] };
type UnarchivePayload = { action: "unarchive"; ids: string[] };
type DeletePayload = { action: "delete"; ids: string[] }; // soft delete
type QuickReplyPayload = {
  action: "quick_reply";
  id: string;
  template?: "thanks" | "viewing" | "application";
};

// legacy single update (no action)
type LegacySingleUpdatePayload = { id: string; status: string };

type PatchPayload =
  | BulkSetStatusPayload
  | ArchivePayload
  | UnarchivePayload
  | DeletePayload
  | QuickReplyPayload
  | LegacySingleUpdatePayload;

function isObject(x: unknown): x is Record<string, any> {
  return typeof x === "object" && x !== null;
}

function hasAction(x: unknown): x is Record<string, any> & { action: string } {
  return isObject(x) && typeof x.action === "string";
}

function isLegacySingleUpdate(x: unknown): x is LegacySingleUpdatePayload {
  return (
    isObject(x) &&
    !("action" in x) &&
    typeof x.id === "string" &&
    typeof x.status === "string"
  );
}

function isBulkSetStatus(x: unknown): x is BulkSetStatusPayload {
  return (
    hasAction(x) &&
    x.action === "set_status" &&
    Array.isArray(x.ids) &&
    x.ids.every((v: any) => typeof v === "string") &&
    typeof x.status === "string"
  );
}

function isArchive(x: unknown): x is ArchivePayload {
  return (
    hasAction(x) &&
    x.action === "archive" &&
    Array.isArray(x.ids) &&
    x.ids.every((v: any) => typeof v === "string")
  );
}

function isUnarchive(x: unknown): x is UnarchivePayload {
  return (
    hasAction(x) &&
    x.action === "unarchive" &&
    Array.isArray(x.ids) &&
    x.ids.every((v: any) => typeof v === "string")
  );
}

function isDelete(x: unknown): x is DeletePayload {
  return (
    hasAction(x) &&
    x.action === "delete" &&
    Array.isArray(x.ids) &&
    x.ids.every((v: any) => typeof v === "string")
  );
}

function isQuickReply(x: unknown): x is QuickReplyPayload {
  const okTemplate =
    !("template" in (x as any)) ||
    (x as any).template === "thanks" ||
    (x as any).template === "viewing" ||
    (x as any).template === "application";

  return hasAction(x) && x.action === "quick_reply" && typeof x.id === "string" && okTemplate;
}

/** ------------------------------------------------------------------------ */

export async function GET(req: Request) {
  if (!isAdmin(req)) return noStoreJson({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const archived = searchParams.get("archived"); // "true" | "false" | null
  const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10) || 100, 500);

  if (id) {
    const { data, error } = await supabase
      .from("tenant_inquiries")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) return noStoreJson({ error: "Failed to fetch inquiry" }, { status: 500 });
    if (!data) return noStoreJson({ error: "Not found" }, { status: 404 });
    return noStoreJson({ inquiry: data });
  }

  let q = supabase
    .from("tenant_inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  // Respect dashboard tabs
  if (archived === "true") q = q.eq("is_archived", true).is("deleted_at", null);
  if (archived === "false") q = q.eq("is_archived", false).is("deleted_at", null);

  const { data, error } = await q;
  if (error) return noStoreJson({ error: "Failed to fetch inquiries" }, { status: 500 });

  return noStoreJson({ inquiries: data ?? [] });
}

export async function PATCH(req: Request) {
  if (!isAdmin(req)) return noStoreJson({ error: "Unauthorized" }, { status: 401 });

  const body: unknown = await req.json();

  // Legacy single status update (no action)
  if (isLegacySingleUpdate(body)) {
    const { error } = await supabase
      .from("tenant_inquiries")
      .update({ status: body.status })
      .eq("id", body.id);

    if (error) return noStoreJson({ error: "Failed to update status" }, { status: 500 });
    return noStoreJson({ ok: true });
  }

  // Bulk status update
  if (isBulkSetStatus(body)) {
    if (!body.ids.length) return noStoreJson({ error: "Missing ids" }, { status: 400 });
    if (!body.status) return noStoreJson({ error: "Missing status" }, { status: 400 });

    const { error } = await supabase
      .from("tenant_inquiries")
      .update({ status: body.status })
      .in("id", body.ids);

    if (error) return noStoreJson({ error: "Failed to update status" }, { status: 500 });
    return noStoreJson({ ok: true });
  }

  // Archive
  if (isArchive(body)) {
    if (!body.ids.length) return noStoreJson({ error: "Missing ids" }, { status: 400 });

    const { error } = await supabase
      .from("tenant_inquiries")
      .update({ is_archived: true, archived_at: new Date().toISOString() })
      .in("id", body.ids);

    if (error) return noStoreJson({ error: "Failed to archive" }, { status: 500 });
    return noStoreJson({ ok: true });
  }

  // Unarchive
  if (isUnarchive(body)) {
    if (!body.ids.length) return noStoreJson({ error: "Missing ids" }, { status: 400 });

    const { error } = await supabase
      .from("tenant_inquiries")
      .update({ is_archived: false, archived_at: null })
      .in("id", body.ids);

    if (error) return noStoreJson({ error: "Failed to unarchive" }, { status: 500 });
    return noStoreJson({ ok: true });
  }

  // Soft delete (only deletes archived rows)
  if (isDelete(body)) {
    if (!body.ids.length) return noStoreJson({ error: "Missing ids" }, { status: 400 });

    const { error } = await supabase
      .from("tenant_inquiries")
      .update({ deleted_at: new Date().toISOString() })
      .in("id", body.ids)
      .eq("is_archived", true);

    if (error) return noStoreJson({ error: "Failed to delete" }, { status: 500 });
    return noStoreJson({ ok: true });
  }

  // Quick reply
  if (isQuickReply(body)) {
    const id = body.id;
    const template = body.template ?? "thanks";

    const { data, error } = await supabase
      .from("tenant_inquiries")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return noStoreJson({ error: "Inquiry not found" }, { status: 404 });

    const toEmail = (data.email as string | null) ?? null;
    const fullName = (data.full_name as string | null) ?? "there";
    const propertyName = "831 Partington Ave";

    if (!toEmail) return noStoreJson({ error: "Inquiry has no email address" }, { status: 400 });

    let subject = "";
    let textBody = "";

    if (template === "viewing") {
      subject = `Viewing times for ${propertyName}`;
      textBody = `Hi ${fullName},

Thank you for your interest in ${propertyName}.

We’d be happy to arrange a viewing. Please reply with a few days / times that work for you over the next week, and we’ll confirm a slot.

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
    } catch {
      return noStoreJson({ error: "Failed to send email" }, { status: 500 });
    }

    await supabase.from("tenant_inquiries").update({ status: "contacted" }).eq("id", id);
    return noStoreJson({ ok: true });
  }

  return noStoreJson({ error: "Unsupported action/payload" }, { status: 400 });
}
