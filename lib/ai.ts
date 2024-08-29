
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

export async function getGoogleResponseObject(body: any, schema: any, temperature: number = 0.0001) {
  const result = await generateObject({
    model: google('gemini-1.5-flash', {
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE',
        },
      ],
    }),
    schema,
    messages: body,
    temperature: temperature,
  });

  return result;
}

