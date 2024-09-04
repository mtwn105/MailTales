import { generateEmbeddings } from './ai'; // Assuming this function exists in your project
import * as schema from './drizzle/schema';
import { eq } from 'drizzle-orm';

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import Nylas, { ListMessagesQueryParams } from 'nylas';

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export const db = drizzle(sql, { schema });


import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
  brokers: [`${process.env.UPSTASH_KAFKA_BROKERS}`],
  ssl: true,
  sasl: {
    mechanism: 'scram-sha-256',
    username: `${process.env.UPSTASH_KAFKA_USERNAME}`,
    password: `${process.env.UPSTASH_KAFKA_PASSWORD}`
  },
  logLevel: logLevel.ERROR,
  retry: {
    initialRetryTime: 100,
    retries: 100,
  }
});

const consumer = kafka.consumer({
  groupId: 'consumer_group_1', retry: {
    initialRetryTime: 100,
    retries: 100,
  }
});

const run = async () => {

  // This configuration will consume both pending and new messages
  const admin = kafka.admin();
  await admin.connect();
  await admin.resetOffsets({
    groupId: 'consumer_group_1',
    topic: 'generate-email-embeddings',
    earliest: true // Set to true to start from the earliest offset
  });
  await admin.disconnect();

  await consumer.connect();
  await consumer.subscribe({ topic: 'generate-email-embeddings', fromBeginning: true });


  // Note: With this setup, the consumer will process all pending messages
  // from the earliest available offset, as well as any new messages that
  // arrive after it has started. This ensures no messages are missed.

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });

      const userId = Number(message.value?.toString());

      console.log("Generating email embeddings for user", userId);

      await generateEmailEmbeddings(userId);
    },
  });
};

run().catch(e => console.error('Error running consumer', e));

const getEmails = async (grantId: string, limit: number = 5, pageToken: string | null = null) => {

  console.log("Getting emails for grantId", grantId);

  const nylas = new Nylas({
    apiKey: process.env.NYLAS_API_KEY!,
    apiUri: process.env.NYLAS_API_URI!,
  });

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

const generateEmailEmbeddings = async (userId: number) => {

  try {

    let [user] = await db.update(schema.user).set({ embeddingGenerationStatus: "in_progress" }).where(eq(schema.user.id, userId)).returning();

    const grantId = user?.grantId;

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
    console.error("Error generating email embeddings:", error);
  }
}