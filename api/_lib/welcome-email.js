export const LINKS = {
  site: 'https://omakar.com',
  whatsapp: 'https://chat.whatsapp.com/Hsro096RlZlEGUfFGcmfRe',
  instagram: 'https://www.instagram.com/omakar.app',
  terms: 'https://omakar.com/terms-of-use',
  privacy: 'https://omakar.com/privacy-policy',
  logo: 'https://omaakar.vercel.app/omakar.png',
  liveDarshanImage: 'https://omaakar.vercel.app/live-darshan.jpg',
  beginJourneyImage: 'https://omaakar.vercel.app/begin-journey.jpg',
};

export const SUBJECT = "You're on the Omakar waitlist";

const FEATURES = [
  {
    icon: '&#x1FA94;',
    title: 'Build your Sadhana',
    text: "Show up every day, even for a moment. That's how devotion becomes a part of you.",
  },
  {
    icon: '&#x1F514;',
    title: 'Aarti Reminders',
    text: 'Get notified before your aarti begins. Never miss the moment that matters.',
  },
  {
    icon: '&#x1F6D5;',
    title: 'Live Darshan',
    text: 'Watch the aarti live, as it happens. No replays, no recordings. The real moment.',
  },
  {
    icon: '&#x1F64F;',
    title: 'Direct Donation',
    text: 'Sacred rituals, performed at the temple, in your name.',
  },
];

const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";

const C = {
  page: '#F4EEE2',
  card: '#FFFFFF',
  soft: '#FBF7EF',
  line: '#EADFC8',
  gold: '#B8862F',
  button: '#8F6420',
  ink: '#2B2118',
  body: '#4A3F33',
  muted: '#8A7C66',
};

function featureRows() {
  return FEATURES.map(
    (f, i) => `
              <tr>
                <td style="padding:${i === 0 ? '0' : '18px'} 0 0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="48" valign="top" style="width:48px;">
                        <div style="width:40px;height:40px;line-height:40px;border-radius:20px;background:${C.soft};border:1px solid ${C.line};text-align:center;font-size:19px;">${f.icon}</div>
                      </td>
                      <td valign="top" style="padding-left:14px;">
                        <p style="margin:0 0 4px;font-family:${SERIF};font-size:17px;line-height:1.35;color:${C.ink};font-weight:bold;">${f.title}</p>
                        <p style="margin:0;font-family:${SANS};font-size:14.5px;line-height:1.6;color:${C.body};">${f.text}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>`
  ).join('');
}

export function renderWelcomeHtml({ unsubscribeUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${SUBJECT}</title>
  <style>
    @media only screen and (max-width:600px) {
      .px { padding-left:24px !important; padding-right:24px !important; }
      .hero { font-size:32px !important; }
    }
    a { text-decoration:none; }
  </style>
</head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    Your temple is never far away. Thank you for joining the Omakar waitlist.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
    <tr>
      <td align="center" style="padding:36px 12px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;background:${C.card};border-radius:18px;overflow:hidden;border:1px solid ${C.line};">

          <!-- Header -->
          <tr>
            <td align="center" class="px" style="padding:36px 40px 0;">
              <a href="${LINKS.site}"><img src="${LINKS.logo}" width="110" alt="Omakar" style="display:block;width:110px;height:auto;border:0;outline:none;"></a>
              <p style="margin:22px 0 0;font-family:${SANS};font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:${C.gold};font-weight:bold;">You're on the waitlist</p>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td align="center" class="px" style="padding:14px 40px 30px;">
              <h1 class="hero" style="margin:0;font-family:${SERIF};font-size:38px;line-height:1.15;font-weight:normal;color:${C.ink};">Live. Sacred. Yours.</h1>
              <p style="margin:12px 0 0;font-family:${SERIF};font-size:17px;line-height:1.5;font-style:italic;color:${C.muted};">Your temple is never far away.</p>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:0 40px 30px;">
              <img src="${LINKS.liveDarshanImage}" width="480" alt="Live aarti from Kashi Vishwanath streaming in the Omakar app" style="display:block;width:100%;max-width:480px;height:auto;border:0;outline:none;border-radius:14px;">
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid ${C.line};font-size:0;line-height:0;">&nbsp;</td></tr></table>
            </td>
          </tr>

          <!-- Letter -->
          <tr>
            <td class="px" style="padding:30px 40px 6px;font-family:${SANS};font-size:15.5px;line-height:1.75;color:${C.body};">
              <p style="margin:0 0 18px;font-family:${SERIF};font-size:18px;color:${C.ink};">Namaste,</p>
              <p style="margin:0 0 18px;">Thank you for joining the Omakar waitlist. We're truly glad you're here.</p>
              <p style="margin:0 0 18px;">The morning aarti. The bell. The flame. You know this feeling. But life moves, and the temple stays behind.</p>
              <p style="margin:0;">Omakar brings it back. Live Darshan from your neighbourhood temple, wherever you are in the world.</p>
            </td>
          </tr>

          <!-- Features -->
          <tr>
            <td class="px" style="padding:28px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.soft};border:1px solid ${C.line};border-radius:14px;">
                <tr>
                  <td style="padding:26px 24px;">
                    <p style="margin:0 0 20px;font-family:${SANS};font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:${C.gold};font-weight:bold;">What's coming</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${featureRows()}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What happens next -->
          <tr>
            <td class="px" style="padding:28px 40px 0;">
              <img src="${LINKS.beginJourneyImage}" width="480" alt="Begin your journey in the Omakar app" style="display:block;width:100%;max-width:480px;height:auto;border:0;outline:none;border-radius:14px;">
            </td>
          </tr>
          <tr>
            <td class="px" style="padding:28px 40px 0;font-family:${SANS};font-size:15.5px;line-height:1.75;color:${C.body};">
              <p style="margin:0 0 18px;">We're working closely with our first temple partner to get every detail right. As an early member, you'll be the first to know when we go live, and the first to get access.</p>
              <p style="margin:0;">Until then, join our WhatsApp community for aarti timings, temple stories and launch updates.</p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" class="px" style="padding:26px 40px 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="${C.button}" style="border-radius:12px;background:${C.button};">
                    <a href="${LINKS.whatsapp}" target="_blank" style="display:inline-block;padding:15px 34px;font-family:${SANS};font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:12px;">Join our WhatsApp Community &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign off -->
          <tr>
            <td class="px" style="padding:26px 40px 38px;font-family:${SANS};font-size:15.5px;line-height:1.75;color:${C.body};">
              <p style="margin:0;">With gratitude,<br><span style="font-family:${SERIF};font-size:17px;color:${C.ink};font-weight:bold;">The Omakar Team</span></p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" class="px" style="background:${C.soft};border-top:1px solid ${C.line};padding:26px 40px 30px;font-family:${SANS};">
              <p style="margin:0 0 10px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">Follow our journey</p>
              <p style="margin:0 0 20px;font-size:13.5px;">
                <a href="${LINKS.instagram}" style="color:${C.button};font-weight:bold;text-decoration:none;">Instagram</a>
                <span style="color:${C.line};">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <a href="${LINKS.whatsapp}" style="color:${C.button};font-weight:bold;text-decoration:none;">WhatsApp Community</a>
              </p>
              <p style="margin:0 0 6px;font-size:12px;line-height:1.6;color:${C.muted};">You're receiving this because you joined the Omakar waitlist at <a href="${LINKS.site}" style="color:${C.muted};text-decoration:underline;">omakar.com</a>.</p>
              <p style="margin:0 0 14px;font-size:12px;line-height:1.6;color:${C.muted};">Bedrock Retail LLP &middot; Bangalore, India</p>
              <p style="margin:0;font-size:12px;line-height:1.6;">
                <a href="${LINKS.terms}" style="color:${C.muted};text-decoration:underline;">Terms of Use</a>
                <span style="color:${C.muted};">&nbsp;&middot;&nbsp;</span>
                <a href="${LINKS.privacy}" style="color:${C.muted};text-decoration:underline;">Privacy Policy</a>
                <span style="color:${C.muted};">&nbsp;&middot;&nbsp;</span>
                <a href="${unsubscribeUrl}" style="color:${C.muted};text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderWelcomeText({ unsubscribeUrl }) {
  const features = FEATURES.map((f) => `${f.title}\n${f.text}`).join('\n\n');
  return `Live. Sacred. Yours.
Your temple is never far away.

Namaste,

Thank you for joining the Omakar waitlist. We're truly glad you're here.

The morning aarti. The bell. The flame. You know this feeling. But life moves, and the temple stays behind.

Omakar brings it back. Live Darshan from your neighbourhood temple, wherever you are in the world.

WHAT'S COMING

${features}

We're working closely with our first temple partner to get every detail right. As an early member, you'll be the first to know when we go live, and the first to get access.

Until then, join our WhatsApp community for aarti timings, temple stories and launch updates:
${LINKS.whatsapp}

With gratitude,
The Omakar Team

Instagram: ${LINKS.instagram}
WhatsApp Community: ${LINKS.whatsapp}
Terms of Use: ${LINKS.terms}
Privacy Policy: ${LINKS.privacy}
Unsubscribe: ${unsubscribeUrl}

Bedrock Retail LLP, Bangalore, India
`;
}
