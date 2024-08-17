import { NextRequest, NextResponse } from "next/server";
import Nylas from "nylas";

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY!,
  apiUri: process.env.NYLAS_API_URI!,
});

console.log(nylas);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("Request for auth coming");
    const authUrl = nylas.auth.urlForOAuth2({
      clientId: process.env.NYLAS_CLIENT_ID!,
      provider: "google",
      redirectUri: process.env.NYLAS_REDIRECT_URI!,
      scope: ["https://www.googleapis.com/auth/gmail.readonly"]
    });
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Handler error:", error);
    return new NextResponse(null, { status: 500 });
  }
}
