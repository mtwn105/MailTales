import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as schema from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

import { db } from "@/lib/db";
import { findRelevantEmails } from "@/lib/email";
import { getGoogleResponse } from "@/lib/ai";

export const maxDuration = 60;

export async function POST(
  request: Request & NextRequest,
) {
  try {
    const cookieStore = cookies();

    const userDetails = JSON.parse(cookieStore.get("mailtales_user_details")?.value!);

    const [user] = await db.select().from(schema.user).where(eq(schema.user.id, userDetails.id))

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );
    }

    const { messages } = await request.json();

    // console.log("Messages", messages);

    const query = messages[messages.length - 1].content;

    const relevantEmails = await findRelevantEmails(query);

    console.log("Relevant Emails", relevantEmails);

    const context = relevantEmails.map((e, i) => `Email ${i + 1}:\nSubject: ${e.subject}\nFrom: ${e.from}\nDate: ${e.date}\nSnippet: ${e.snippet}`).join("\n\n");


    const aiResponse = await getGoogleResponse([{
      role: 'system',
      content: `"You are an AI email assistant that sorts, prioritizes, summarizes, drafts replies, manages tasks, detects spam, and maintains a professional tone while respecting user preferences and privacy.".`
    }, {
      role: 'user',
      content: `Context: ${context}\n\nQuestion: ${query}`
    }])

    return aiResponse.toDataStreamResponse();

  } catch (error) {

    console.error("Error while replying to email ai query:", error);

    return NextResponse.json(
      { error: "Error while replying to email ai query" },
      { status: 500 },
    );
  }
}
