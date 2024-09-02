
import { google } from '@ai-sdk/google';
import {  embedMany, } from 'ai';

export async function generateEmbeddings(emailStrings: string[]) {
  const { embeddings } = await embedMany({
    model: google.embedding('text-embedding-004'),
    values: emailStrings,
  });

  return embeddings;
}