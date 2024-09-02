import Nylas, { type ListMessagesQueryParams } from "nylas";
import { generateEmbedding, generateEmbeddings } from "@/lib/ai";
import { db } from "@/lib/db";
import * as schema from '@/drizzle/schema';
import { cosineDistance, eq, gt, desc, sql, and } from 'drizzle-orm';

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY!,
  apiUri: process.env.NYLAS_API_URI!,
});

export async function getEmails(grantId: string, limit: number = 5, pageToken: string | null = null) {

  const queryParams: ListMessagesQueryParams = {
    in: ["INBOX"],
    limit: limit,
  }

  if (pageToken && pageToken.length > 0) {
    queryParams.pageToken = pageToken;
  }

  const messages = await nylas.messages.list({
    identifier: grantId!,
    queryParams,
  });

  return messages;
}

export async function generateEmailEmbedding(user: any) {

  try {

    const response = await fetch(`${process.env.UPSTASH_KAFKA_REST_URL}/produce`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${process.env.UPSTASH_KAFKA_REST_AUTH}`
      },
      body: JSON.stringify({ topic: "generate-email-embeddings", value: user.id })
    })

    if (response.ok) {
      console.log("Email embedding generation started");
    } else {
      console.log("Error generating email embedding", response);
    }

  } catch (error) {
    console.log("Error generating email embedding", error);
  }

}


export const findRelevantEmails = async (userQuery: string, userId: number) => {

  console.log("Finding relevant emails for query", userQuery);

  const userQueryEmbedded = await generateEmbedding(userQuery);

  console.log("User query embedded", userQueryEmbedded);
  const similarity = sql<number>`1 - (${cosineDistance(
    schema.emailEmbeddings.embedding,
    userQueryEmbedded,
  )})`;


  console.log("Similarity", similarity);
  const similarEmails = await db
    .select({ snippet: schema.emailEmbeddings.snippet, subject: schema.emailEmbeddings.subject, date: schema.emailEmbeddings.date, from: schema.emailEmbeddings.from, to: schema.emailEmbeddings.to, similarity })
    .from(schema.emailEmbeddings)
    .where(and(gt(similarity, 0.5), eq(schema.emailEmbeddings.userId, userId)))
    .orderBy(t => desc(t.similarity))
    .limit(4);


  console.log("Similar Emails", similarEmails);
  return similarEmails;
};