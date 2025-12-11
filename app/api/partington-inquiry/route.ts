import { NextResponse } from "next/server";
import { Resend } from "resend";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

type InquiryPayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  moveInDate?: string;
  groupType?: string;
  source?: string;
  message?: string;
  consent?: boolean | string;
};

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Partington Inquiry] RESEND_API_KEY is not set. Email skipped.");
    return null;
  }
  return new Resend(apiKey);
}

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn(
      "[Partington Inquiry] OPENAI_API_KEY is not set. AI will fall back to static reply."
    );
    return null;
  }
  return new OpenAI({ apiKey });
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.warn(
      "[Partington Inquiry] Supabase URL or SERVICE_ROLE key missing. Skipping DB insert."
    );
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as InquiryPayload;
    const {
      fullName,
      email,
      phone,
      moveInDate,
      groupType,
      source,
      message,
      consent,
    } = body;

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const consentLabel =
      typeof consent === "boolean"
        ? consent
          ? "Checked"
          : "Not checked"
        : consent
        ? "Checked"
        : "Not provided";

    const subject = `New Partington Inquiry – ${fullName}`;

    /* -------------------------------------------
       1) Insert into tenant_inquiries (if possible)
       ------------------------------------------- */
    const supabase = getSupabaseAdmin();
    let aiSummary: string | null = null;

    // We’ll fill aiSummary below once we have AI reply text
    // For now, just prepare basic row payload.
    const baseRow = {
      property_slug: "831-partington-main",
      full_name: fullName,
      email,
      phone: phone || null,
      move_in_date: moveInDate || null,
      group_type: groupType || null,
      message,
      consent:
        typeof consent === "boolean"
          ? consent
          : consent
          ? true
          : null,
      source: source || "Partington listing page",
      ai_quality_score: null,
      ai_summary: null,
      ai_raw: null as any,
      status: "new" as const,
    };

    /* -------------------------------------------
       2) Internal email to you
       ------------------------------------------- */
    const ownerHtml = `
      <div style="font-family: system-ui; padding: 16px; background:#050816; color:#e5e7eb;">
        <h2 style="margin:0 0 8px;font-size:20px;">New inquiry for 831 Partington Ave</h2>
        <p style="margin:0 0 16px;font-size:14px;color:#9ca3af;">
          Someone submitted the form on your Partington listing page.
        </p>

        <table cellpadding="6" cellspacing="0" style="font-size:13px;">
          <tr><td style="color:#9ca3af;">Name</td><td>${fullName}</td></tr>
          <tr><td style="color:#9ca3af;">Email</td><td>${email}</td></tr>
          ${phone ? `<tr><td style="color:#9ca3af;">Phone</td><td>${phone}</td></tr>` : ""}
          ${
            moveInDate
              ? `<tr><td style="color:#9ca3af;">Move-in</td><td>${moveInDate}</td></tr>`
              : ""
          }
          ${
            groupType
              ? `<tr><td style="color:#9ca3af;">Group</td><td>${groupType}</td></tr>`
              : ""
          }
          ${
            source
              ? `<tr><td style="color:#9ca3af;">Source</td><td>${source}</td></tr>`
              : ""
          }
          <tr><td style="color:#9ca3af;">Consent</td><td>${consentLabel}</td></tr>
        </table>

        <div style="margin-top:16px; border-top:1px solid #1f2937; padding-top:12px;">
          <p style="margin:0 0 4px;color:#9ca3af;">Message:</p>
          <p style="white-space:pre-line;">${message}</p>
        </div>
      </div>
    `;

    const resend = getResend();
    let emailSent = false;

    if (resend) {
      const sendInternal = await resend.emails.send({
        from: `Oasis International Real Estate <notifications@oasisintlrealestate.com>`,
        to: "oasisintlrealestate@gmail.com",
        replyTo: email,
        subject,
        html: ownerHtml,
      });

      if (!sendInternal.error) {
        emailSent = true;
      }
    }

    /* -------------------------------------------
       3) AI / Nūr auto-reply construction
       ------------------------------------------- */

    // Default fallback reply if AI is unavailable
    let replyBody = `
Thank you for your inquiry about 831 Partington Ave.

We’ve received your message and Nūr has logged your details for our leasing team.
This is an executive-style main unit (3 bedrooms + finished basement, fenced yard, upgraded mechanicals).

We’ll follow up shortly with availability, viewing options, and next steps.
If you have any urgent questions, you can reply directly to this email.

– Nūr El-Oasis
  Leasing Assistant, Oasis International Real Estate
  Windsor, Ontario
    `.trim();

    const openai = getOpenAI();
    let aiRaw: any = null;

    if (openai) {
      try {
        const ai = await openai.chat.completions.create({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content:
                "You are Nūr El-Oasis, a warm, professional leasing assistant for Oasis International Real Estate in Windsor, Ontario. " +
                "You reply to inquiries about the executive-style main unit at 831 Partington Ave (3 bedrooms + finished basement, fenced yard, upgraded mechanicals). " +
                "Thank them, acknowledge the inquiry, avoid promising availability, and offer to coordinate a viewing and next steps. Keep it 2–4 short paragraphs.",
            },
            {
              role: "user",
              content: `
Name: ${fullName}
Email: ${email}
Phone: ${phone || "Not provided"}
Move-in: ${moveInDate || "Not provided"}
Group: ${groupType || "Not provided"}
Source: ${source || "Not provided"}

Message:
${message}
              `.trim(),
            },
          ],
        });

        aiRaw = ai;
        const aiReply = ai.choices?.[0]?.message?.content?.trim();
        if (aiReply) {
          replyBody = aiReply;
        }

        // Simple AI summary for DB (first 280 chars of reply)
        aiSummary = replyBody.slice(0, 280);
      } catch (err) {
        console.error(
          "[AI Auto-Reply] Error generating reply, using static fallback:",
          err
        );
      }
    } else {
      aiSummary = replyBody.slice(0, 280);
    }

    /* -------------------------------------------
       4) Now that we have AI info, write to DB
       ------------------------------------------- */
    let dbInserted = false;

    if (supabase) {
      const { error: insertError } = await supabase.from("tenant_inquiries").insert({
        ...baseRow,
        ai_summary: aiSummary,
        ai_raw: aiRaw,
      });

      if (insertError) {
        console.error("[Partington Inquiry] Error inserting tenant_inquiries:", insertError);
      } else {
        dbInserted = true;
      }
    }

    /* -------------------------------------------
       5) Send auto-reply email as Nūr
       ------------------------------------------- */
    let autoReplySent = false;

    if (resend) {
      try {
        const autoReplyHtml = `
          <div style="font-family: system-ui; padding: 16px; background:#fafafa; color:#111;">
            <h2 style="margin:0 0 12px;font-size:20px;">Thank you, ${fullName}.</h2>
            <div style="font-size:14px; line-height:1.5;">
              ${replyBody
                .split("\n")
                .map((line) => `<p style="margin:0 0 8px;">${line}</p>`)
                .join("")}
            </div>

            <hr style="margin:20px 0;border-top:1px solid #ddd;" />

            <p style="font-size:13px;color:#555;">
              <strong>Your message:</strong><br/>
              ${message.replace(/\n/g, "<br/>")}
            </p>

            <p style="margin-top:20px;font-size:12px;color:#888;">
              Nūr El-Oasis · Leasing Assistant<br/>
              Oasis International Real Estate · Windsor, Ontario<br/>
              oasisintlrealestate.com
            </p>
          </div>
        `;

        const sendAuto = await resend.emails.send({
          from: `Nūr El-Oasis <notifications@oasisintlrealestate.com>`,
          to: email,
          subject: "Thanks for your inquiry about 831 Partington Ave",
          html: autoReplyHtml,
        });

        if (!sendAuto.error) {
          autoReplySent = true;
        } else {
          console.error("[Partington Inquiry] Error sending auto-reply:", sendAuto.error);
        }
      } catch (err) {
        console.error("[Partington Inquiry] Exception sending auto-reply:", err);
      }
    }

    return NextResponse.json(
      {
        ok: true,
        emailSent,
        autoReplySent,
        dbInserted,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Partington Inquiry API error:", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
