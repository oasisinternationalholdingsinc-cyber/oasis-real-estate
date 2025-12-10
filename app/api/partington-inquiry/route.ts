import { NextResponse } from "next/server";
import { Resend } from "resend";
import OpenAI from "openai";

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
    console.warn("[Partington Inquiry] OPENAI_API_KEY is not set. AI will fall back to static reply.");
    return null;
  }
  return new OpenAI({ apiKey });
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

    // ---------- EMAIL TO YOU ----------
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
      } else {
        console.error("[Partington Inquiry] Error sending internal email:", sendInternal.error);
      }
    } else {
      console.error("[Partington Inquiry] Resend not configured, cannot send emails.");
    }

    // ---------- AI / STATIC AUTO-REPLY TO TENANT ----------
    let autoReplySent = false;

    // Default static reply (in case AI is unavailable or fails)
    let replyBody = `
Thank you for your inquiry about 831 Partington Ave.

We've received your message and will follow up shortly with availability, viewing options, and next steps.
This is an executive-style main unit (3 bedrooms + finished basement, fenced yard, upgraded mechanicals).

If you have any urgent questions, you can reply directly to this email.

– Oasis International Real Estate
Windsor, Ontario
    `.trim();

    const openai = getOpenAI();

    if (openai) {
      try {
        const ai = await openai.chat.completions.create({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a warm, professional leasing assistant for Oasis International Real Estate. " +
                "You reply to inquiries about 831 Partington Ave. Respond politely, thank them, summarize next steps, " +
                "do NOT promise availability, mention that it's an executive-style main unit with 3 bedrooms + finished basement, " +
                "and offer to coordinate viewing if appropriate.",
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

        const aiReply =
          ai.choices?.[0]?.message?.content?.trim() || null;

        if (aiReply) {
          replyBody = aiReply;
        }
      } catch (err) {
        console.error("[AI Auto-Reply] Error generating reply, using static fallback:", err);
      }
    }

    const autoReplyHtml = `
      <div style="font-family: system-ui; padding: 16px; background:#fafafa; color:#111;">
        <h2 style="margin:0 0 12px;font-size:20px;">Thank you, ${fullName}!</h2>
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
          Oasis International Real Estate · Windsor, Ontario<br/>
          oasisintlrealestate.com
        </p>
      </div>
    `;

    if (resend) {
      try {
        const sendAuto = await resend.emails.send({
          from: `Oasis International Real Estate <notifications@oasisintlrealestate.com>`,
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
      { ok: true, emailSent, autoReplySent },
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
