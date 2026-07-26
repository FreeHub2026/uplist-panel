export async function placeOrder(env, { service, link, quantity }) {
  const form = new URLSearchParams({
    key: env.PROVIDER_API_KEY,
    action: "add",
    service: String(service),
    link: String(link),
    quantity: String(quantity),
  });
  const res = await fetch(env.PROVIDER_API_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form,
  });
  return res.json().catch(() => ({ error: "Supplier returned a non-JSON response." }));
}

export async function getStatus(env, orderId) {
  const form = new URLSearchParams({
    key: env.PROVIDER_API_KEY,
    action: "status",
    order: orderId,
  });
  const res = await fetch(env.PROVIDER_API_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form,
  });
  return res.json().catch(() => ({ error: "Supplier returned a non-JSON response." }));
}
