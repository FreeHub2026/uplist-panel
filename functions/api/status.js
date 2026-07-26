import { getStatus } from "./_lib/supplier.js";

export async function onRequestGet(context) {
  const { request, env } = context;

  if (!env.PROVIDER_API_URL || !env.PROVIDER_API_KEY) {
    return json({ error: "No supplier configured yet." }, 503);
  }

  const url = new URL(request.url);
  const orderId = url.searchParams.get("order");
  if (!orderId) {
    return json({ error: "order query param is required." }, 400);
  }

  const data = await getStatus(env, orderId);
  return json(data);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
