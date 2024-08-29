export async function getResponse(body: any) {
  const response = await fetch(`${process.env.CLOUDFLARE_API_URL}/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${process.env.CLOUDFLARE_AI_MODEL}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
    },
  });
  return response.json();
}