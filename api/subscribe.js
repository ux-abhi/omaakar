export default async function handler(req, res) {

  // CORS — set first, always
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight — respond before anything else can fail
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse body safely
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

    // Check env vars exist BEFORE using them
    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!apiKey) {
      return res.status(500).json({ error: 'RESEND_API_KEY is missing in environment variables' });
    }
    if (!audienceId) {
      return res.status(500).json({ error: 'RESEND_AUDIENCE_ID is missing in environment variables' });
    }

    // Import resend INSIDE the handler so a load error is catchable
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    // 1. Add to audience
    await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    // 2. Send welcome email
    await resend.emails.send({
      from: 'Omakar <onboarding@resend.dev>',
      to: email,
      subject: "You're on the Omakar waitlist",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#FAF4E8;text-align:center;">
          <p style="font-size:48px;margin:0 0 16px;">&#2384;</p>
          <h1 style="font-size:26px;color:#2E2419;margin:0 0 10px;">You're on the waitlist.</h1>
          <p style="font-size:16px;color:#5C5142;margin:0 0 32px;">Your daily darshan is coming soon.</p>
          <div style="background:#fff;border-radius:16px;padding:28px 32px;text-align:left;">
            <p style="font-size:15px;color:#2E2419;line-height:1.7;margin:0 0 14px;">
              We're building Omakar — a live darshan and daily puja app that brings the temple to you, every single morning.
            </p>
            <p style="font-size:15px;color:#5C5142;line-height:1.7;margin:0;">
              You'll be the first to know when we go live. Early members get first access.
            </p>
          </div>
          <p style="font-size:13px;color:#B8892E;margin:24px 0 0;">Omakar &middot; Your daily darshan.</p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });

  } catch (error) {
    // Return the REAL error so we can see it
    return res.status(500).json({
      error: 'Function failed',
      detail: error.message || String(error)
    });
  }
}
