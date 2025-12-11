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

export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const { data, error } = await supabase
      .from("tenant_inquiries")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("GET single inquiry error", error);
      return NextResponse.json({ error: "Failed to fetch inquiry" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ inquiry: data });
  }

  const { data, error } = await supabase
    .from("tenant_inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("GET inquiries error", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }

  return NextResponse.json({ inquiries: data ?? [] });
}

type PatchBody = {
  id?: string;
  status?: string;
  action?: "quick_reply";
  template?: "thanks" | "viewing" | "application";
};

export async function PATCH(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as PatchBody;
  const { id, status, action, template = "thanks" } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // status-only update
  if (status && !action) {
    const { error } = await supabase
      .from("tenant_inquiries")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Update status error", error);
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
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

    const toEmail = data.email as string | null;
    const fullName = (data.full_name as string | null) ?? "there";
    const propertyName = "831 Partington Ave";

    if (!toEmail) {
      return NextResponse.json(
        { error: "Inquiry has no email address" },
        { status: 400 }
      );
    }

    let subject = "";
    let textBody = "";
    let htmlBody = "";

    if (template === "viewing") {
      subject = `Viewing times for ${propertyName}`;
      textBody = `Hi ${fullName},

Thank you for your interest in ${propertyName}. 

We’d be happy to arrange a viewing. Please reply with a few days / times that work for you over the next week, and we’ll confirm a slot.

Best regards,
Oasis International Real Estate Inc.`;

      htmlBody = textBody.replace(/\n/g, "<br/>");
    } else if (template === "application") {
      subject = `Next steps for ${propertyName}`;
      textBody = `Hi ${fullName},

Thank you again for your interest in ${propertyName}.

To move forward, we’ll need a completed rental application and supporting documents (photo ID, proof of income, references). We’ll follow up with a secure link to submit everything.

Best regards,
Oasis International Real Estate Inc.`;

      htmlBody = textBody.replace(/\n/g, "<br/>");
    } else {
      // default "thanks" template
      subject = `We received your inquiry about ${propertyName}`;
      textBody = `Hi ${fullName},

Thank you for your inquiry about ${propertyName}. 

We’ve received your details and will follow up shortly with available viewing times and next steps.

Best regards,
Oasis International Real Estate Inc.`;

      htmlBody = textBody.replace(/\n/g, "<br/>");
    }

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
      // still return ok (email already sent), but mention issue
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
