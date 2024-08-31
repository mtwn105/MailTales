import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Nylas from "nylas";

import { getGoogleResponse, getGoogleResponseObject } from "@/lib/ai";
import { z } from "zod";

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY!,
  apiUri: process.env.NYLAS_API_URI!,
});

export const maxDuration = 60;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {

    const cookieStore = cookies();

    const userDetails = JSON.parse(cookieStore.get("mailtales_user_details")?.value!);

    const grantId = userDetails.grantId;
    const emailId = params.id;

    const message = await nylas.messages.find({
      identifier: grantId!,
      messageId: emailId,
    });

    console.log("Found email");

    if (!message.data.body) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    const { body } = await request.json();

    console.log("Going to get response from AI");

    const aiResponse = await getGoogleResponseObject([
      {
        role: "system",
        content: "Perform sentiment analysis on the email body and provide a score between 0 and 100. 0 is negative and 100 is positive.",
      },
      {
        role: "user",
        content: `Email Body: ${body}`,
      },
    ],
      z.object({
        sentiment: z.number(),
      })
    );
    const response = aiResponse.toJsonResponse();
    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error("Error fetching email:", error);
    return NextResponse.json(
      { error: "Error fetching email" },
      { status: 500 }
    );
  }
}