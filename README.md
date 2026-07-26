# Uplist

A wholesale-style SMM panel storefront: a rate board, an order form, and order tracking,
wired to a generic backend that speaks the common SMM provider API shape
(`key` / `action=add|status` / `service` / `link` / `quantity`).

## What's here

- `index.html` — the storefront (static, no build step)
- `functions/api/order.js` — places an order with your supplier
- `functions/api/status.js` — checks an order's status with your supplier

The order form and "Track an order" box are fully wired. They'll return
`"No supplier configured yet"` until you add real credentials — that's expected.

## Deploying (free)

`functions/` requires a host that runs serverless functions, which plain GitHub Pages
does not. Cloudflare Pages does, on its free tier, and deploys straight from this same
GitHub repo:

1. Sign up at pages.cloudflare.com (free).
2. "Create a project" → "Connect to Git" → select this repo (`uplist-panel`).
3. Build settings: framework preset "None", build command blank, output directory `/`.
4. Deploy. You'll get a free `*.pages.dev` URL, and it redeploys automatically on every push.

## Adding your supplier

Once you've picked and tested a real SMM provider, add two environment variables in
the Cloudflare Pages project → Settings → Environment variables:

- `PROVIDER_API_URL` — the provider's API endpoint (e.g. `https://provider.example/api/v2`)
- `PROVIDER_API_KEY` — your account's API key

Redeploy after adding them (or trigger via a new commit). No code changes needed —
the order form and tracker start working against your real supplier immediately.

## Before this goes live

- **No payment collection yet.** As-is, anyone who finds the site can submit real
  orders that spend your supplier balance for free. Wire up a payment step
  (Stripe/PayPal will reject engagement-selling accounts — expect to need a
  high-risk-friendly processor or crypto) before sharing this publicly.
- **No accounts/auth.** Orders aren't tied to a customer or a paid balance yet.
