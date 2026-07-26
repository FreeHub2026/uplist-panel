import { getService } from "./_lib/catalog.js";

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.STRIPE_SECRET_KEY) {
    return json({ error: "Payments aren't configured yet. Set STRIPE_SECRET_KEY in your Pages project settings." }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const service = getService(body.service);
  const link = (body.link || "").trim();
  const quantity = Number(body.quantity);

  if (!service) return json({ error: "Unknown service." }, 400);
  if (!link) return json({ error: "A link or username is required." }, 400);
  if (!Number.isFinite(quantity) || quantity < service.min || quantity > service.max) {
    return json({ error: `Quantity must be between ${service.min} and ${service.max}.` }, 400);
  }

  // Price is computed server-side from the catalog — never trust a client-supplied amount.
  const amountCents = Math.round((service.rate / 1000) * quantity * 100);
  if (amountCents < 50) {
    return json({ error: "Order total is below the minimum chargeable amount ($0.50)." }, 400);
  }

  const origin = new URL(request.url).origin;
  const form = new URLSearchParams({
    mode: "payment",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][product_data][name]": `${service.name} — ${quantity.toLocaleString()} units`,
    "line_items[0][price_data][unit_amount]": String(amountCents),
    "line_items[0][quantity]": "1",
    success_url: `${origin}/?checkout=success`,
    cancel_url: `${origin}/?checkout=cancelled`,
    "metadata[service]": service.id,
    "metadata[link]": link,
    "metadata[quantity]": String(quantity),
  });

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: form,
  });

  const data = await stripeRes.json();
  if (!stripeRes.ok) {
    return json({ error: data.error?.message || "Could not start checkout." }, stripeRes.status);
  }
  return json({ url: data.url });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
