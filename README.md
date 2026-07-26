# Uplist

A wholesale-style SMM panel storefront: a rate board, Stripe checkout, and order
tracking, wired to a generic backend that speaks the common SMM provider API shape
(`key` / `action=add|status` / `service` / `link` / `quantity`).

## What's here

- `index.html` — the storefront (static, no build step)
- `functions/api/_lib/catalog.js` — the service list + prices (server-side source of truth)
- `functions/api/_lib/supplier.js` — shared calls to your supplier's API
- `functions/api/create-checkout.js` — starts a Stripe Checkout session for an order
- `functions/api/stripe-webhook.js` — **places the order with your supplier, but only after Stripe confirms the payment succeeded**
- `functions/api/status.js` — checks an order's status with your supplier
- `functions/api/order.js` — admin/testing endpoint only, guarded by `ADMIN_KEY`; not used by the public site

Money flow: customer clicks Buy → Stripe Checkout → Stripe charges the card →
Stripe calls `stripe-webhook.js` → the order is placed with your supplier. The order
form never places an order directly, so there's no way to get a free order by calling
the API without paying.

## Deploying (free)

`functions/` requires a host that runs serverless functions, which plain GitHub Pages
does not. Cloudflare Pages does, on its free tier, and deploys straight from this same
GitHub repo:

1. Sign up at pages.cloudflare.com (free).
2. "Create a project" → "Connect to Git" → select this repo (`uplist-panel`).
3. Build settings: framework preset "None", build command blank, output directory `/`.
4. Deploy. You'll get a free `*.pages.dev` URL, and it redeploys automatically on every push.

## Setting up Stripe (free to set up; Stripe takes a % per transaction)

1. Create a Stripe account at stripe.com.
2. Dashboard → Developers → API keys → copy the **Secret key**.
3. In Cloudflare Pages → your project → Settings → Environment variables, add:
   - `STRIPE_SECRET_KEY` = your Stripe secret key
4. Dashboard → Developers → Webhooks → "Add endpoint":
   - Endpoint URL: `https://<your-pages-url>/api/stripe-webhook`
   - Event to send: `checkout.session.completed`
   - After creating it, copy the **Signing secret** it gives you.
5. Back in Cloudflare Pages env vars, add:
   - `STRIPE_WEBHOOK_SECRET` = that signing secret
6. Redeploy (or push a commit) so the new env vars take effect.

Note: Stripe's terms prohibit accounts selling fake engagement/followers — expect
your account to face review or be closed once they see what's being sold. A
high-risk-friendly processor or crypto payments are the realistic alternative if/when
that happens; the webhook pattern here would need adapting to whatever that
processor's equivalent of "payment confirmed" event is.

## Adding your supplier

Once you've picked and tested a real SMM provider, add two more environment variables:

- `PROVIDER_API_URL` — the provider's API endpoint (e.g. `https://provider.example/api/v2`)
- `PROVIDER_API_KEY` — your account's API key

Redeploy after adding them. No code changes needed — orders will start actually
reaching your supplier as soon as a payment comes in.

## Testing without spending real money

Stripe has a **test mode** (toggle in the dashboard) with its own test API keys and
fake card numbers (e.g. `4242 4242 4242 4242`, any future expiry, any CVC) that let
you run the entire flow — checkout, webhook, order placement — without moving real
money. Use test mode keys until you've confirmed everything works end to end.

## Still missing before this is customer-ready

- **Accounts/auth** — orders aren't tied to a logged-in customer yet, so there's no
  order history a customer can log in and see.
- **A real supplier** — this only works once you've found and funded one (see the
  rest of this conversation for how that search works and what to check for).
