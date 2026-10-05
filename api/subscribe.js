import {
  LINKS,
  SUBJECT,
  renderWelcomeHtml,
  renderWelcomeText,
} from './_lib/welcome-email.js';
import { unsubscribeUrl } from './_lib/unsubscribe-token.js';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function baseUrl(req) {
  if (process.env.PUBLIC_BASE_URL) {
    return process.env.PUBLIC_BASE_URL.replace(/\/$/, '');
  }
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `https://${host}`;
}
// Save the email to Google Sheets through Apps Script.
async function saveToGoogleSheets(email) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_SECRET;
  if (!url || !secret) {
    throw new Error('Google Sheets environment variables are missing');
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      secret,
    }),
    redirect: 'follow',
    signal: AbortSignal.timeout(10000),
  });
  const responseText = await response.text();
  let result;
  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error(
      'Apps Script returned a non-JSON response. Check the deployment URL and access permissions.'
    );
  }
  // Apps Script can return HTTP 200 even when saving fails.
  if (!response.ok || result?.success !== true) {
    throw new Error(
      result?.error || 'Google Sheets could not save the email'
    );
  }
  return result;
}
export default async function handler(req, res) {
  // CORS — set first, always.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }
  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const email = String(body?.email || '').trim().toLowerCase();
    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return res.status(400).json({
        error: 'Please enter a valid email address',
      });
    }
    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!apiKey || !audienceId) {
      console.error('Resend environment variables are missing');
      return res.status(500).json({
        error: 'Waitlist service is not configured',
      });
    }
    if (
      !process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
      !process.env.GOOGLE_SHEETS_SECRET
    ) {
      console.error('Google Sheets environment variables are missing');
      return res.status(500).json({
        error: 'Waitlist service is not configured',
      });
    }
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    // Add the contact to Resend.
    const contact = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });
    if (
      contact.error &&
      !/already exists/i.test(contact.error.message || '')
    ) {
      console.error('Resend contacts.create failed', contact.error);
      return res.status(502).json({
        error: 'Could not add you to the waitlist, please try again',
      });
    }
    // Add the email to Google Sheets.
    try {
      await saveToGoogleSheets(email);
    } catch (error) {
      console.error(
        'Google Sheets save failed:',
        error?.message || String(error)
      );
      return res.status(502).json({
        error: 'Could not complete your signup. Please try again.',
      });
    }
    // Send the existing welcome email.
    const unsubscribe = unsubscribeUrl(baseUrl(req), email);
    const sent = await resend.emails.send({
      from: 'Omakar <hello@omakar.com>',
      to: email,
      replyTo: 'hello@omakar.com',
      subject: SUBJECT,
      html: renderWelcomeHtml({
        unsubscribeUrl: unsubscribe,
      }),
      text: renderWelcomeText({
        unsubscribeUrl: unsubscribe,
      }),
      headers: {
        'List-Unsubscribe': `<${unsubscribe}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });
    if (sent.error) {
      console.error('Resend emails.send failed', sent.error);
      return res.status(502).json({
        error:
          'You are on the list, but we could not send the welcome email',
      });
    }
    return res.status(200).json({
      ok: true,
      whatsapp: LINKS.whatsapp,
    });
  } catch (error) {
    console.error('subscribe failed', error);
    return res.status(500).json({
      error: 'Could not complete your signup. Please try again.',
    });
  }
}
