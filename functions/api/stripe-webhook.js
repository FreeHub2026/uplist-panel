import { placeOrder } from "./_lib/supplier.js";

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Webhook not configured.", { status: 503 });
  }

  const payload = await request.text();
  const sigHeader = request.headers.get("stripe-signature");
  if (!sigHeader || !(await verifySignature(payload, sigHeader, env.STRIPE_WEBHOOK_SECRET))) {
    return new Response("Invalid signature.", { status: 400 });
  }

  const event = JSON.parse(payload);

  if (event.type === "checkout.session.completed") {
    const md = event.data.object.metadata || {};
    if (md.service && md.link && md.quantity) {
      // Fulfillment happens here, server-to-server, only once Stripe confirms payment.
      await placeOrder(env, { service: md.service, link: md.link, quantity: md.quantity });
    }
  }

  return new Response("ok", { status: 200 });
}

async function verifySignature(payload, sigHeader, secret) {
  const parts = Object.fromEntries(sigHeader.split(",").map((p) => p.split("=")));
  if (!parts.t || !parts.v1) return false;

  // Reject payloads older than 5 minutes to prevent replay attacks.
  const age = Math.abs(Date.now() / 1000 - Number(parts.t));
  if (age > 300) return false;

  const signedPayload = `${parts.t}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  const expected = [...new Uint8Array(sigBuffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return expected === parts.v1;
}
