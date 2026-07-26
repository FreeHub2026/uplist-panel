export async function onRequestPost(context) {
  const { request, env } = context;

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

  const form = new URLSearchParams({
    key: env.PROVIDER_API_KEY,
    action: "add",
    service: String(service),
    link: String(link),
    quantity: String(quantity),
  });

  const providerRes = await fetch(env.PROVIDER_API_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form,
  });

  const data = await providerRes.json().catch(() => ({ error: "Supplier returned a non-JSON response." }));
  return json(data, providerRes.status);
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
