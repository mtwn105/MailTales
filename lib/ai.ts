
import { google } from '@ai-sdk/google';
import { CoreMessage, generateObject, streamText } from 'ai';
import { z } from 'zod';

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

export async function getGoogleResponse(body: any) {
  const result = await streamText({
    model: google('gemini-1.5-flash'),
    messages: body,
    temperature: 0.0001,
  });

  return result;
}

export async function getGoogleResponseObject(body: any, schema: any) {
  const result = await generateObject({
    model: google('gemini-1.5-flash'),
    schema,
    messages: body,
    temperature: 0.0001,
  });

  return result;
}

