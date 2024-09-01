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

    [user] = await db.update(schema.user).set({ embeddingGenerationStatus: "in_progress" }).where(eq(schema.user.id, user.id)).returning();

    // Get first 30 emails by 15 in loop
    let emails = [];
    let pageToken = null;
    for (let i = 0; i < 2; i++) {
      const emailPage = await getEmails(user?.grantId, 15, pageToken);
      emails.push(...emailPage.data);
      pageToken = emailPage.nextCursor;
    }

    emails = emails.filter(e => e.snippet && e.snippet?.length > 0).map(e => ({
      userId: user.id,
      emailId: e.id,
      subject: e.subject,
      snippet: e.snippet,
      date: e.date,
      from: e.from?.[0]?.email,
      to: e.to?.[0]?.email,
    }));

    const emailStrings = emails.map((e) => `Email
    Subject: ${e.subject}
    From: ${e.from}
    To: ${e.to}
    Snippet: ${e.snippet}
    Date: ${new Date(e.date! * 1000).toLocaleDateString() + " " + new Date(e.date! * 1000).toLocaleTimeString()}`);

    // console.log("Email Strings", emailStrings);

    let embedding = await generateEmbeddings(emailStrings);

    // console.log("Embedding", embedding);

    let emailsWithEmbeddings = emails.map((e, index) => ({
      userId: e.userId! as number,
      emailId: e.emailId! as string,
      subject: e.subject! as string,
      snippet: e.snippet! as string,
      date: new Date(e.date! * 1000) as Date,
      from: e.from! as string,
      to: e.to! as string,
      embedding: embedding[index].map((e) => e) as number[],
    }));

    // delete all existing email embeddings for this user
    await db.delete(schema.emailEmbeddings).where(eq(schema.emailEmbeddings.userId, user.id));

    await db.insert(schema.emailEmbeddings).values(emailsWithEmbeddings);

    await db.update(schema.user).set({ embeddingGenerationStatus: "completed", dataLastRefreshed: new Date(), updatedAt: new Date() }).where(eq(schema.user.id, user.id));

    console.log("Embedding updated in db");

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