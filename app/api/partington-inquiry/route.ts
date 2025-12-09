import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      moveInDate,
      groupType,
      source,
      message,
      consent,
    } = body as {
      fullName?: string;
      email?: string;
      phone?: string;
      moveInDate?: string;
      groupType?: string;
      source?: string;
      message?: string;
      consent?: string;
    };

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const subject = `New Partington Inquiry – ${fullName}`;

    const html = `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 16px; background:#050816; color:#e5e7eb;">
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
              ? `<tr><td style="color:#9ca3af;">Who will live here?</td><td style="color:#e5e7eb;">${groupType}</td></tr>`
              : ""
          }
          ${
            source
              ? `<tr><td style="color:#9ca3af;">How they heard about it</td><td style="color:#e5e7eb;">${source}</td></tr>`
              : ""
          }
          <tr>
            <td style="color:#9ca3af;">Consent</td>
            <td style="color:#e5e7eb;">${consent ? "Checked" : "Not provided"}</td>
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

    const { error } = await resend.emails.send({
      from: `Oasis International Real Estate <notifications@oasisintlrealestate.com>`,
      to: "notifications@oasisintlrealestate.com",   // ✅ UPDATED — FINAL DESTINATION
      replyTo: email,                                 // ✔️ Keep this so you can reply instantly
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to send email." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Partington inquiry API error:", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
