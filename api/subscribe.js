import { LINKS, SUBJECT, renderWelcomeHtml, renderWelcomeText } from './_lib/welcome-email.js';
import { unsubscribeUrl } from './_lib/unsubscribe-token.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function baseUrl(req) {
  if (process.env.PUBLIC_BASE_URL) return process.env.PUBLIC_BASE_URL.replace(/\/$/, '');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `https://${host}`;
}

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
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    const email = String(body?.email || '').trim().toLowerCase();

    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
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

    // The SDK returns { data, error } instead of throwing, so errors must be checked.
    const contact = await resend.contacts.create({ email, audienceId, unsubscribed: false });
    if (contact.error && !/already exists/i.test(contact.error.message || '')) {
      console.error('Resend contacts.create failed', contact.error);
      return res.status(502).json({ error: 'Could not add you to the waitlist, please try again' });
    }
try {
  await saveToGoogleSheets(email);
} catch (error) {
  console.error('Google Sheets save failed:', error.message);
  return res.status(502).json({
    error: 'Could not complete your signup. Please try again.',
  });
}
    const unsubscribe = unsubscribeUrl(baseUrl(req), email);

    const sent = await resend.emails.send({
      from: 'Omakar <hello@omakar.com>',
      to: email,
      replyTo: 'hello@omakar.com',
      subject: SUBJECT,
      html: renderWelcomeHtml({ unsubscribeUrl: unsubscribe }),
      text: renderWelcomeText({ unsubscribeUrl: unsubscribe }),
      headers: {
        'List-Unsubscribe': `<${unsubscribe}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });
    if (sent.error) {
      console.error('Resend emails.send failed', sent.error);
      return res.status(502).json({ error: 'You are on the list, but we could not send the welcome email' });
    }

    return res.status(200).json({ ok: true, whatsapp: LINKS.whatsapp });

  } catch (error) {
    console.error('subscribe failed', error);
    return res.status(500).json({
      error: 'Function failed',
      detail: error.message || String(error)
    });
  }
}
