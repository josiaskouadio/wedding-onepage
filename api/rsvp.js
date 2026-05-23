export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const payload =
    typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body || {};

  if (!payload.name || !payload.email || !payload.attendance) {
    return response.status(400).json({ error: "Missing required RSVP fields" });
  }

  if (process.env.RSVP_WEBHOOK_URL) {
    const webhookResponse = await fetch(process.env.RSVP_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      return response.status(502).json({ error: "RSVP webhook failed" });
    }
  }

  return response.status(200).json({ ok: true });
}
