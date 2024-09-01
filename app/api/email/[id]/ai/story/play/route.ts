import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Nylas from "nylas";

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

  } catch (error) {
    console.error("Error fetching email:", error);
    return NextResponse.json(
      { error: "Error fetching email" },
      { status: 500 }
    );
  }
}
