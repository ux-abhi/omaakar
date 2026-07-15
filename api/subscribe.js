export default async function handler(req, res) {

  // CORS — set first, always
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let email;
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      email = body?.email;
    } catch (e) {
      email = req.body?.email;
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!apiKey) {
      return res.status(500).json({ error: 'RESEND_API_KEY is missing in environment variables' });
    }
    if (!audienceId) {
      return res.status(500).json({ error: 'RESEND_AUDIENCE_ID is missing in environment variables' });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    await resend.emails.send({
      from: 'Omakar <hello@omakar.com>',
      to: email,
      subject: "You're on the list, welcome to Omakar",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="margin:0;padding:0;background:#EFE9DC;font-family:Georgia,'Times New Roman',serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#EFE9DC;">
            <tr>
              <td align="center" style="padding:40px 20px;">
                <table width="540" cellpadding="0" cellspacing="0" style="max-width:540px;width:100%;">

                  <!-- ===== TOP BANNER ===== -->
                  <tr>
                    <td style="background:#1A3A6B;border-radius:14px 14px 0 0;padding:28px 24px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <img src="https://omaakar.vercel.app/omakar.png"
                                 width="120" alt="Omakar"
                                 style="display:block;margin:0 auto 10px;border:0;outline:none;">
                            <div style="font-family:Georgia,'Times New Roman',serif;font-size:12.5px;
                                        font-style:italic;color:#D9C9A3;letter-spacing:0.3px;">
                              Daily Devotion. Lifelong Transformation.
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- ===== BODY CARD ===== -->
                  <tr>
                    <td style="background:#FFFFFF;padding:40px 36px;">

                      <p style="margin:0 0 22px;font-size:17px;line-height:1.7;color:#2E2419;">
                        Namaste,
                      </p>

                      <p style="margin:0 0 20px;font-size:15.5px;line-height:1.8;color:#3D3427;">
                        Thank you for joining the Omakar waitlist. You've just taken the first step toward carrying your temple with you, wherever you are.
                      </p>

                      <p style="margin:0 0 20px;font-size:15.5px;line-height:1.8;color:#3D3427;">
                        Omakar started with a simple belief: that darshan shouldn't depend on distance, and that devotion deserves a home of its own online, not lost between reels and notifications. We're building Omakar so you can join live darshan and aarti, and have pujas performed in your name, in a temple near you, with the same faith and care you'd bring in person.
                      </p>

                      <p style="margin:0 0 20px;font-size:15.5px;line-height:1.8;color:#3D3427;">
                        We're currently working closely with our first temple partner to get every detail right before opening things up more widely. As one of our early members, you'll be the first to know the moment we go live, and the first to get access.
                      </p>

                      <p style="margin:0 0 24px;font-size:15.5px;line-height:1.8;color:#3D3427;">
                        In the meantime, join our WhatsApp channel for aarti timings, temple stories, and updates as we get closer to launch:
                      </p>

                      <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                        <tr>
                          <td style="border-radius:10px;background:#DD7A2E;">
                            <a href="https://chat.whatsapp.com/Hsro096RlZlEGUfFGcmfR"
                               style="display:inline-block;padding:13px 26px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:10px;">
                              Join our WhatsApp Channel
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0 0 6px;font-size:15.5px;line-height:1.8;color:#3D3427;">
                        We're grateful to have you with us from the very beginning.
                      </p>

                      <p style="margin:22px 0 0;font-size:15.5px;line-height:1.7;color:#2E2419;">
                        With gratitude,<br>
                        <strong>The Omakar Team</strong>
                      </p>

                    </td>
                  </tr>

                  <!-- ===== FOOTER ===== -->
                  <tr>
                    <td style="background:#F6F1E7;border-radius:0 0 14px 14px;padding:28px 32px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding-bottom:14px;">
                            <span style="font-family:Arial,sans-serif;font-size:12px;color:#8A7A5F;">
                              Follow our journey
                            </span>
                            <br>
                            <a href="INSTAGRAM_LINK" style="color:#1A3A6B;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;margin:0 8px;">Instagram</a>
                            <span style="color:#C9BB9E;">&bull;</span>
                            <a href="https://chat.whatsapp.com/Hsro096RlZlEGUfFGcmfRe" style="color:#1A3A6B;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;margin:0 8px;">WhatsApp</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="border-top:1px solid #E2D8C3;padding-top:16px;" align="center">
                            <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11.5px;color:#9C8F76;line-height:1.6;">
                              Bedrock Retail LLP &middot; Bangalore, India
                            </p>
                            <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:11.5px;color:#9C8F76;line-height:1.6;">
                              You're receiving this because you joined the Omakar waitlist at omakar.com
                            </p>
                            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#B3A788;">
                              <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#B3A788;text-decoration:underline;">Unsubscribe</a>
                              &nbsp;&middot;&nbsp;
                              <a href="https://omakar.framer.website/privacy-policy" style="color:#B3A788;text-decoration:underline;">Privacy Policy</a>
                            </p>
                          </td>
                        </tr>
                      </table>
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

    return res.status(200).json({ ok: true });

  } catch (error) {
    return res.status(500).json({
      error: 'Function failed',
      detail: error.message || String(error)
    });
  }
}
