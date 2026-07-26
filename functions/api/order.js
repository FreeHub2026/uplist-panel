import { placeOrder } from "./_lib/supplier.js";

// Admin/testing endpoint only — real customer orders are placed by stripe-webhook.js
// after payment is confirmed, never directly from the public order form.
export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.ADMIN_KEY || request.headers.get("x-admin-key") !== env.ADMIN_KEY) {
    return json({ error: "Unauthorized." }, 401);
  }

  if (!env.PROVIDER_API_URL || !env.PROVIDER_API_KEY) {
    return json({ error: "No supplier configured yet. Set PROVIDER_API_URL and PROVIDER_API_KEY in your Pages project settings." }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const { service, link, quantity } = body;
  if (!service || !link || !quantity) {
    return json({ error: "service, link, and quantity are required." }, 400);
  }

  const data = await placeOrder(env, { service, link, quantity });
  return json(data);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
