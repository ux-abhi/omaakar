import crypto from 'node:crypto';

// Signs unsubscribe links so nobody can unsubscribe an address they don't own.
function secret() {
  const key = process.env.UNSUBSCRIBE_SECRET || process.env.RESEND_API_KEY;
  if (!key) throw new Error('UNSUBSCRIBE_SECRET or RESEND_API_KEY must be set');
  return key;
}

export function encodeEmail(email) {
  return Buffer.from(email, 'utf8').toString('base64url');
}

export function decodeEmail(encoded) {
  return Buffer.from(String(encoded || ''), 'base64url').toString('utf8');
}

export function signEmail(email) {
  return crypto.createHmac('sha256', secret()).update(email).digest('base64url');
}

export function verifyEmail(email, token) {
  const expected = Buffer.from(signEmail(email));
  const given = Buffer.from(String(token || ''));
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}

export function unsubscribeUrl(baseUrl, email) {
  return `${baseUrl}/api/unsubscribe?e=${encodeEmail(email)}&t=${signEmail(email)}`;
}
