# Demo mailer

A small Cloudflare Worker behind the "Book a demo" form. For each request it sends,
through Resend:

- **to the team:** the client's details. Hitting reply answers the client directly.
- **to the client:** a confirmation. Their reply comes back to the team.

The Resend API key is stored only as a Worker secret. It never appears in the website.

## Where it runs

- **Worker:** `baseline-demo-mailer` in the Cloudflare account that manages baselineagent.io
  (Hamzasajjad159@gmail.com's Account).
  URL: https://baseline-demo-mailer.hamzasajjad159.workers.dev
- **Settings:** in Cloudflare under Workers & Pages → baseline-demo-mailer → Settings →
  Variables and secrets. They mirror `wrangler.toml`.
- **Resend:** the `baselineagent` team, domain `baselineagent.io`, with DNS records added in
  Cloudflare. Receiving is left off so Google Workspace mail is untouched.
- **To change the code:** edit `worker.js` here, then either paste it into the dashboard
  (Edit code → Deploy) or run `npx wrangler deploy` from this folder.

## One-time setup

### 1. Resend: verify the domain and create a key
1. Sign up at https://resend.com.
2. Go to **Domains → Add domain** and enter your company domain.
3. Add the DNS records Resend shows (SPF, DKIM) at your domain registrar or DNS host.
   Wait until the domain shows **Verified**.
4. Go to **API Keys → Create API key**, with **Sending access** only. Copy it. You only need it in step 3.

### 2. Settings
Edit `wrangler.toml`:
- `TEAM_EMAIL`: the inbox that should receive bookings.
- `FROM_EMAIL`: the sender, on the verified domain, e.g. `Baseline <demo@yourcompany.com>`.
- `ALLOWED_ORIGINS`: the website's address(es). Add your own domain if the site moves there.

### 3. Deploy to Cloudflare (free)
Sign up at https://dash.cloudflare.com, then from this folder run:

```bash
npx wrangler login
npx wrangler secret put RESEND_API_KEY
npx wrangler deploy
```

- `npx wrangler login` opens a browser window to approve.
- `npx wrangler secret put RESEND_API_KEY` asks you to paste the key.
- `npx wrangler deploy` prints the Worker URL, e.g. `https://baseline-demo-mailer.<name>.workers.dev`.

### 4. Point the form at it
In `baseline-website/contact.html`, set the form's `data-endpoint` to that URL, then push.

## Limits
The Resend free plan allows 100 emails a day and 3,000 a month. Each booking uses 2:
the team notification and the client confirmation.
