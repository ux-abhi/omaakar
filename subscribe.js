import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

  // ── CORS ──────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── Method check ──────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Email check ───────────────────────────────────────
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {

    // ── 1. Add to Resend Audience ─────────────────────
    await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID,
      unsubscribed: false,
    });

    // ── 2. Send welcome email ─────────────────────────
    await resend.emails.send({
      from: 'Omakar <hello@omakar.app>',   // ← change to your verified domain
      to: email,
      subject: 'You\'re on the Omakar waitlist 🙏',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="margin:0;padding:0;background:#FAF4E8;font-family:sans-serif;">

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding: 48px 24px;">

                <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">

                  <!-- OM Symbol -->
                  <tr>
                    <td align="center" style="padding-bottom:16px;">
                      <span style="font-size:48px;line-height:1;">ॐ</span>
                    </td>
                  </tr>

                  <!-- Heading -->
                  <tr>
                    <td align="center" style="padding-bottom:10px;">
                      <h1 style="margin:0;font-size:26px;color:#2E2419;font-weight:600;line-height:1.2;">
                        You're on the waitlist.
                      </h1>
                    </td>
                  </tr>

                  <!-- Subheading -->
                  <tr>
                    <td align="center" style="padding-bottom:36px;">
                      <p style="margin:0;font-size:16px;color:#5C5142;line-height:1.5;">
                        Your daily darshan is coming soon.
                      </p>
                    </td>
                  </tr>

                  <!-- Card -->
                  <tr>
                    <td style="background:#FFFFFF;border-radius:16px;padding:28px 32px;">
                      <p style="margin:0 0 14px;font-size:15px;color:#2E2419;line-height:1.7;">
                        We're building Omakar — a live darshan and daily puja app 
                        that brings the temple to you, every single morning.
                      </p>
                      <p style="margin:0;font-size:15px;color:#5C5142;line-height:1.7;">
                        You'll be the first to know when we go live. 
                        Early members get first access as we onboard new temples.
                      </p>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td style="padding:28px 0 0;">
                      <hr style="border:none;border-top:1px solid rgba(122,42,38,0.15);margin:0;">
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding-top:20px;">
                      <p style="margin:0;font-size:13px;color:#B8892E;letter-spacing:0.05em;">
                        ॐ Omakar · Your daily darshan.
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
      `,
    });

    // ── 3. Success ────────────────────────────────────
    return res.status(200).json({ ok: true, message: 'Added to waitlist' });

  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
