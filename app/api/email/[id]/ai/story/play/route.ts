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

    const { text, voice } = await request.json();

    console.log("Going to perform text to speech");

    //   curl--location 'https://api.elevenlabs.io/v1/text-to-speech/pMsXgVXv3BLzUgSXRplE/stream?allow_unauthenticated=1' \
    //   --header 'accept: */*' \
    //   --header 'accept-language: en-US,en;q=0.9,de;q=0.8,hi;q=0.7,en-IN;q=0.6' \
    //   --header 'content-type: application/json' \
    //   --header 'origin: https://elevenlabs.io' \
    //   --header 'priority: u=1, i' \
    //   --header 'referer: https://elevenlabs.io/' \
    //   --header 'sec-ch-ua: "Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128"' \
    //   --header 'sec-ch-ua-mobile: ?0' \
    //   --header 'sec-ch-ua-platform: "Windows"' \
    //   --header 'sec-fetch-dest: empty' \
    //   --header 'sec-fetch-mode: cors' \
    //   --header 'sec-fetch-site: same-site' \
    //   --header 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0' \
    //   --data '{
    //   "text": "what'\''s up",
    //     "model_id": "eleven_turbo_v2_5"
    // }'

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_turbo_v2_5",
      }),
    });

    const audioStream = await response.blob();


    return new NextResponse(audioStream, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });

    // const response = aiResponse.toJsonResponse();
    // return new NextResponse(response.body, {
    //   status: response.status,
    //   headers: response.headers,
    // });

  } catch (error) {
    console.error("Error fetching email:", error);
    return NextResponse.json(
      { error: "Error fetching email" },
      { status: 500 }
    );
  }
}
