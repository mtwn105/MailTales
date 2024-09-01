
import { google } from '@ai-sdk/google';
import { embed, embedMany, generateObject, streamText } from 'ai';


export async function getGoogleResponse(body: any, system: string = "", tools: any = null) {
  const result = await streamText({
    model: google('gemini-1.5-flash'),
    system,
    messages: body,
    temperature: 0.0001,
    tools,
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

export async function generateEmbeddings(emailStrings: string[]) {
  const { embeddings } = await embedMany({
    model: google.embedding('text-embedding-004'),
    values: emailStrings,
  });

  return embeddings;
}


export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: google.embedding('text-embedding-004'),
    value: input,
  });
  return embedding;
};
