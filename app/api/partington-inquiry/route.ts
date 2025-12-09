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
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const subject = `New viewing inquiry – 831 Partington Ave – ${fullName}`;

    const html = `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a;">
        <h2 style="margin-bottom: 4px;">New Viewing / Info Request</h2>
        <p style="margin-top: 0; margin-bottom: 16px; font-size: 13px; color: #64748b;">
          Property: <strong>831 Partington Ave, Windsor, ON</strong>
        </p>

        <h3 style="font-size: 14px; margin-bottom: 4px;">Contact details</h3>
        <table style="font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="padding: 2px 8px 2px 0; color:#64748b;">Name</td>
            <td style="padding: 2px 0;"><strong>${fullName}</strong></td>
          </tr>
          <tr>
            <td style="padding: 2px 8px 2px 0; color:#64748b;">Email</td>
            <td style="padding: 2px 0;">${email}</td>
          </tr>
          ${
            phone
              ? `<tr><td style="padding: 2px 8px 2px 0; color:#64748b;">Phone</td><td style="padding: 2px 0;">${phone}</td></tr>`
              : ""
          }
          ${
            moveInDate
              ? `<tr><td style="padding: 2px 8px 2px 0; color:#64748b;">Preferred move-in</td><td style="padding: 2px 0;">${moveInDate}</td></tr>`
              : ""
          }
          ${
            groupType
              ? `<tr><td style="padding: 2px 8px 2px 0; color:#64748b;">Group type</td><td style="padding: 2px 0;">${groupType}</td></tr>`
              : ""
          }
          ${
            source
              ? `<tr><td style="padding: 2px 8px 2px 0; color:#64748b;">Heard about listing via</td><td style="padding: 2px 0;">${source}</td></tr>`
              : ""
          }
        </table>

        <h3 style="font-size: 14px; margin: 18px 0 6px;">Message</h3>
        <div style="font-size: 13px; padding: 10px 12px; background:#f1f5f9; border-radius: 8px; white-space: pre-wrap;">
          ${message}
        </div>

        <p style="margin-top: 18px; font-size: 11px; color:#94a3b8;">
          Consent checkbox: ${consent ? "✅ checked" : "⬜ not checked"}<br/>
          This email was sent from the Oasis International Real Estate website.
        </p>
      </div>
    `;

    await resend.emails.send({
      from: `Oasis International Real Estate <notifications@oasisintlrealestate.com>`,
      to: "oasisintlrealestate@gmail.com",
      reply_to: email, // so you can just hit Reply
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("partington-inquiry error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send inquiry" },
      { status: 500 }
    );
  }
}
