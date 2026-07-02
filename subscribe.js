const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {

  // CORS — must be first, before everything
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email required' });
    return;
  }

  try {

    // Add to Resend Audience
    await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID,
      unsubscribed: false,
    });

    // Send welcome email
    await resend.emails.send({
      from: 'Omakar <hello@omakar.com>',
      to: email,
      subject: "You're on the Omakar waitlist 🙏",
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#FAF4E8;font-family:sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:48px 24px;">
                <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">
                  <tr>
                    <td align="center" style="padding-bottom:16px;">
                      <span style="font-size:48px;">ॐ</span>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-bottom:10px;">
                      <h1 style="margin:0;font-size:26px;color:#2E2419;font-weight:600;">
                        You're on the waitlist.
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-bottom:36px;">
                      <p style="margin:0;font-size:16px;color:#5C5142;">
                        Your daily darshan is coming soon.
                      </p>
                    </td>
                  </tr>
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
                  <tr>
                    <td align="center" style="padding-top:24px;">
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

    res.status(200).json({ ok: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
