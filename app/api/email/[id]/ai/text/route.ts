import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Nylas from "nylas";

import { getGoogleResponse } from "@/lib/ai";

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY!,
  apiUri: process.env.NYLAS_API_URI!,
});

export const maxDuration = 60;

export async function GET(
  _request: NextRequest,
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

    console.log("Going to get response from AI");

    const aiResponse = await getGoogleResponse([
      {
        role: "system",
        content: "Summarize the email in plain text and provide it as-is, without any introductory or concluding statements. Do not use any markdown formatting. Only provide the summary of the email.",
      },
      {
        role: "user",
        content: `Subject: ${message.data.subject}\nFrom: ${message.data.from?.[0]?.email}\nTo: ${message.data.to?.[0]?.email}\n Email Body: ${message.data.body}`,
      },
    ],
    );
    const response = aiResponse.toTextStreamResponse();
    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    });
    // for await (const chunk of aiResponse?.textStream) {
    //   console.log(chunk);

    // }

    // return NextResponse.json({
    //   "message": "ok"
    // });

    // if (!aiResponse?.result?.response) {
    //   return NextResponse.json({ error: "Error fetching email" }, { status: 500 });
    // }

    // const textBody = aiResponse?.result?.response;

    // return NextResponse.json({
    //   id: message.data.id,
    //   subject: message.data.subject,
    //   from: message.data.from?.[0]?.email,
    //   to: message.data.to?.[0]?.email,
    //   date: message.data.date,
    //   body: message.data.body,
    //   // cleanBody: textBody,
    // });
  } catch (error) {
    console.error("Error fetching email:", error);
    return NextResponse.json(
      { error: "Error fetching email" },
      { status: 500 }
    );
  }
}
