import { LINKS } from './_lib/welcome-email.js';
import { decodeEmail, verifyEmail } from './_lib/unsubscribe-token.js';

function page(title, message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | Omakar</title>
</head>
<body style="margin:0;background:#F4EEE2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#4A3F33;">
  <div style="max-width:440px;margin:80px auto;padding:40px 32px;background:#FFFFFF;border:1px solid #EADFC8;border-radius:18px;text-align:center;">
    <img src="${LINKS.logo}" width="96" alt="Omakar" style="display:block;margin:0 auto 24px;">
    <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:26px;color:#2B2118;">${title}</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;">${message}</p>
    <a href="${LINKS.site}" style="color:#8F6420;font-weight:bold;text-decoration:none;">Visit omakar.com</a>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const email = decodeEmail(req.query?.e);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (!email || !verifyEmail(email, req.query?.t)) {
    return res.status(400).send(page('Link not valid', 'This unsubscribe link is invalid or incomplete. Write to hello@omakar.com and we will remove you right away.'));
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.contacts.update({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID,
      unsubscribed: true,
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error('unsubscribe failed', error);
    return res.status(500).send(page('Something went wrong', 'We could not process your request. Please try again, or write to hello@omakar.com.'));
  }

  return res.status(200).send(page('You are unsubscribed', 'You will no longer receive emails from Omakar. You are always welcome back.'));
}
