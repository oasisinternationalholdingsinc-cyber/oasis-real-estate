import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

function isAdmin(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  return cookie.includes("oasis_admin=1");
}

type PatchBody = {
  id?: string;
  status?: string;
  action?: "quick_reply" | "archive" | "restore";
  template?: "thanks" | "viewing" | "application";
};

export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  // single inquiry
  if (id) {
    const { data, error } = await supabase
      .from("tenant_inquiries")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("GET single inquiry error", error);
      return NextResponse.json(
        { error: "Failed to fetch inquiry" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ inquiry: data });
  }

  // list inquiries
  const includeArchived = searchParams.get("archived") === "1";
  const includeDeleted = searchParams.get("deleted") === "1";

  let q = supabase
    .from("tenant_inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  // Hide archived + deleted by default
  if (!includeArchived) q = q.eq("is_archived", false);
  if (!includeDeleted) q = q.is("deleted_at", null);

  const { data, error } = await q;

  if (error) {
    console.error("GET inquiries error", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }

  return NextResponse.json({ inquiries: data ?? [] });
}

export async function PATCH(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as PatchBody;
  const { id, status, action, template = "thanks" } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // status-only update (your existing status enum values)
  if (status && !action) {
    const { error } = await supabase
      .from("tenant_inquiries")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Update status error", error);
      return NextResponse.json(
        { error: "Failed to update status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  }

  // archive
  if (action === "archive") {
    const { error } = await supabase
      .from("tenant_inquiries")
      .update({
        is_archived: true,
        archived_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Archive error", error);
      return NextResponse.json({ error: "Failed to archive" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  // restore
  if (action === "restore") {
    const { error } = await supabase
      .from("tenant_inquiries")
      .update({
        is_archived: false,
        archived_at: null,
        // NOTE: restore does NOT clear deleted_at automatically
        // (so you can keep "deleted" as a separate state if you want)
      })
      .eq("id", id);

    if (error) {
      console.error("Restore error", error);
      return NextResponse.json({ error: "Failed to restore" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  // quick reply + mark as contacted
  if (action === "quick_reply") {
    const { data, error } = await supabase
      .from("tenant_inquiries")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      console.error("Quick reply fetch error", error);
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const toEmail = (data.email as string | null) ?? null;
    const fullName = ((data.full_name as string | null) ?? "there").trim();
    const propertyName =
      (data.property_slug as string | null) === "partington"
        ? "831 Partington Ave"
        : "your selected property";

    if (!toEmail) {
      return NextResponse.json(
        { error: "Inquiry has no email address" },
        { status: 400 }
      );
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

    const htmlBody = textBody.replace(/\n/g, "<br/>");

    try {
      await resend.emails.send({
        from: "Oasis International Real Estate <notifications@oasisintlrealestate.com>",
        to: toEmail,
        subject,
        text: textBody,
        html: htmlBody,
      });
    } catch (err) {
      console.error("Quick reply email error", err);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("tenant_inquiries")
      .update({ status: "contacted" })
      .eq("id", id);

    if (updateError) {
      console.error("Quick reply status update error", updateError);
      return NextResponse.json(
        { ok: true, warning: "Email sent but status update failed" },
        { status: 200 }
      );
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { error: "Nothing to do with given payload" },
    { status: 400 }
  );
}

export async function DELETE(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    id?: string;
    hard?: boolean;
  };

  const id = body.id;
  const hard = body.hard === true;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // Fetch current state so we can enforce safe delete rules
  const { data, error } = await supabase
    .from("tenant_inquiries")
    .select("id, is_archived, deleted_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    console.error("Delete fetch error", error);
    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
  }

  // Hard delete only allowed if already archived or already soft-deleted
  if (hard) {
    if (!data.is_archived && !data.deleted_at) {
      return NextResponse.json(
        { error: "Hard delete requires the inquiry to be archived first." },
        { status: 400 }
      );
    }

    const { error: delErr } = await supabase
      .from("tenant_inquiries")
      .delete()
      .eq("id", id);

    if (delErr) {
      console.error("Hard delete error", delErr);
      return NextResponse.json(
        { error: "Failed to hard delete" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, hard: true });
  }

  // Soft delete (also archives)
  const now = new Date().toISOString();
  const { error: softErr } = await supabase
    .from("tenant_inquiries")
    .update({
      is_archived: true,
      archived_at: now,
      deleted_at: now,
    })
    .eq("id", id);

  if (softErr) {
    console.error("Soft delete error", softErr);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, hard: false });
}
