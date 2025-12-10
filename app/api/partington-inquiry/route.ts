import { NextResponse } from "next/server";
import { Resend } from "resend";

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
    console.warn(
      "[Partington Inquiry] RESEND_API_KEY is not set. Email will be skipped."
    );
    return null;
  }
  return new Resend(apiKey);
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

    const subject = `New Partington Inquiry – ${fullName}`;
    const consentLabel =
      typeof consent === "boolean"
        ? consent
          ? "Checked"
          : "Not checked"
        : consent
        ? "Checked"
        : "Not provided";

    const html = `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text',
        'Segoe UI', sans-serif; padding: 16px; background:#050816; color:#e5e7eb;">
        <h2 style="margin:0 0 8px;font-size:20px;">New inquiry for 831 Partington Ave</h2>
        <p style="margin:0 0 16px;font-size:14px;color:#9ca3af;">
          Someone just submitted the form on your Partington listing page.
        </p>
        <table cellpadding="6" cellspacing="0" style="font-size:13px; border-collapse:collapse;">
          <tr>
            <td style="color:#9ca3af;">Name</td>
            <td style="color:#e5e7eb;">${fullName}</td>
          </tr>
          <tr>
            <td style="color:#9ca3af;">Email</td>
            <td style="color:#e5e7eb;">${email}</td>
          </tr>
          ${
            phone
              ? `<tr><td style="color:#9ca3af;">Phone</td><td style="color:#e5e7eb;">${phone}</td></tr>`
              : ""
          }
          ${
            moveInDate
              ? `<tr><td style="color:#9ca3af;">Preferred move-in</td><td style="color:#e5e7eb;">${moveInDate}</td></tr>`
              : ""
          }
          ${
            groupType
              ? `<tr><td style="color:#9ca3af;">Who will be living there</td><td style="color:#e5e7eb;">${groupType}</td></tr>`
              : ""
          }
          ${
            source
              ? `<tr><td style="color:#9ca3af;">How they heard about it</td><td style="color:#e5e7eb;">${source}</td></tr>`
              : ""
          }
          <tr>
            <td style="color:#9ca3af;">Consent</td>
            <td style="color:#e5e7eb;">${consentLabel}</td>
          </tr>
        </table>

        <div style="margin-top:16px; padding-top:12px; border-top:1px solid #1f2937;">
          <p style="margin:0 0 4px; font-size:13px; color:#9ca3af;">Message:</p>
          <p style="margin:0; font-size:14px; white-space:pre-line;">${message}</p>
        </div>

        <p style="margin-top:20px;font-size:11px;color:#6b7280;">
          Sent from oasisintlrealestate.com · Partington listing form.
        </p>
      </div>
    `;

    const resend = getResend();

    // If no API key, skip email but don't crash the app
    if (!resend) {
      console.error(
        "[Partington Inquiry] Skipping email send because RESEND_API_KEY is not set."
      );
      return NextResponse.json(
        { ok: true, emailSent: false },
        { status: 200 }
      );
    }

    const { error } = await resend.emails.send({
      from: `Oasis International Real Estate <notifications@oasisintlrealestate.com>`,
      to: "oasisintlrealestate@gmail.com", // 👈 now goes to your real inbox
      replyTo: email,
      subject,
      html,
    });

    if (error) {
      console.error("Error sending Partington inquiry email:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to send email." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, emailSent: true }, { status: 200 });
  } catch (err) {
    console.error("Partington inquiry API error:", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
