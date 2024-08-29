
import { google } from '@ai-sdk/google';
import { generateObject, streamText } from 'ai';


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

