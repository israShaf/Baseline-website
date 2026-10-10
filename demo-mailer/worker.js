// Cloudflare Worker: receives a demo request from the website and sends two emails through Resend.
//   1. A notification to the team (reply goes straight to the client)
//   2. A confirmation to the client (reply goes to the team)
// The Resend API key lives only in the Worker's secrets, never in the website.
//
// Settings (wrangler.toml [vars], or the Cloudflare dashboard):
//   TEAM_EMAIL       where booking notifications go, e.g. sales@yourcompany.com
//   FROM_EMAIL       verified sender, e.g. "Baseline <demo@yourcompany.com>"
//   ALLOWED_ORIGINS  comma-separated site origins allowed to post here
// Secret (wrangler secret put RESEND_API_KEY):
//   RESEND_API_KEY

const LIMITS = { name: 120, email: 200, company: 160, systems: 200, message: 3000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
// Keeps header-bound values (subject, names) on one line
const oneLine = s => String(s).replace(/[\r\n]+/g, ' ').trim();

function cors(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const headers = { 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' };
  if (origin && allowed.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return { headers, ok: Boolean(origin && allowed.includes(origin)) };
}

const json = (body, status, headers) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });

function teamEmail(d) {
  const rows = [['Name', d.name], ['Email', d.email], ['Company', d.company], ['PDM / ERP', d.systems], ['Message', d.message]]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#5E7478;vertical-align:top">${k}</td><td style="padding:6px 0;color:#0E2B2E;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('');
  return {
    subject: oneLine(`Demo request: ${d.name}${d.company ? ` (${d.company})` : ''}`),
    html: `<div style="font-family:Arial,sans-serif;font-size:15px"><p style="color:#0E2B2E">New demo request from the website.</p><table style="border-collapse:collapse">${rows}</table><p style="color:#5E7478;font-size:13px">Reply to this email to answer ${esc(d.name)} directly.</p></div>`,
    text: `New demo request\n\nName: ${d.name}\nEmail: ${d.email}\nCompany: ${d.company || '-'}\nPDM / ERP: ${d.systems || '-'}\n\n${d.message || ''}`,
  };
}

function clientEmail(d) {
  const first = oneLine(d.name).split(' ')[0];
  return {
    subject: 'We’ve got your Baseline demo request',
    html: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0E2B2E;line-height:1.6"><p>Hi ${esc(first)},</p><p>Thanks for booking a Baseline demo. We’ll email you shortly to set a time that works for your team.</p><p>If there’s anything you’d like us to cover, just reply to this email.</p><p>The Baseline team</p></div>`,
    text: `Hi ${first},\n\nThanks for booking a Baseline demo. We’ll email you shortly to set a time that works for your team.\n\nIf there’s anything you’d like us to cover, just reply to this email.\n\nThe Baseline team`,
  };
}

export default {
  async fetch(request, env) {
    const { headers, ok } = cors(request.headers.get('Origin'), env);
    if (request.method === 'OPTIONS') return new Response(null, { status: ok ? 204 : 403, headers });
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, headers);
    if (!ok) return json({ error: 'Origin not allowed' }, 403, headers);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'Invalid request' }, 400, headers); }

    // Honeypot filled in: a bot. Pretend it worked and send nothing.
    if (body['company-site']) return json({ ok: true }, 200, headers);

    const d = {};
    for (const [k, max] of Object.entries(LIMITS)) d[k] = String(body[k] ?? '').trim().slice(0, max);
    if (!d.name || !EMAIL_RE.test(d.email)) return json({ error: 'Name and a valid email are required' }, 422, headers);

    const res = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        { from: env.FROM_EMAIL, to: [env.TEAM_EMAIL], reply_to: d.email, ...teamEmail(d) },
        { from: env.FROM_EMAIL, to: [d.email], reply_to: env.TEAM_EMAIL, ...clientEmail(d) },
      ]),
    });
    if (!res.ok) {
      console.log('Resend error', res.status, await res.text());
      return json({ error: 'Could not send' }, 502, headers);
    }
    return json({ ok: true }, 200, headers);
  },
};
