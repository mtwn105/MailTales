import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Nylas, { type ListMessagesQueryParams } from "nylas";

import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import User from "@/models/User";

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY!,
  apiUri: process.env.NYLAS_API_URI!,
});

export async function GET(
  request: Request & NextRequest,
): Promise<NextResponse> {
  try {
    const cookieStore = cookies();

    console.log("Cookie Store:", cookieStore.getAll());

    const decoded = verifyToken(
      cookieStore.get("mailtales_user_token")?.value!,
    );

    console.log("Decoded:", decoded);

    if (!decoded) {
      return new NextResponse(null, { status: 401 });
    }

    // Fetch user from database
    await connectToDatabase();
    const user = await User.findById(decoded.id);

    console.log("User:", user);

    if (!user) {
      return new NextResponse(null, { status: 401 });
    }

    // Get GrantId
    const grantId = user.grantId;

    console.log("GrantId:", grantId);


    const queryParams: ListMessagesQueryParams = {
      in: ["INBOX"],
      limit: 5,
    }
    const pageToken = request.nextUrl.searchParams.get("pageToken");

    if (pageToken && pageToken.length > 0) {
      queryParams.pageToken = pageToken;
    }

    const messages = await nylas.messages.list({
      identifier: grantId!,
      queryParams,
    });

    const response = messages.data.map((message) => {
      return {
        id: message.id,
        subject: message.subject,
        from: message?.from?.[0]?.email,
        snippet: message?.snippet,
        date: message?.date,
      }
    })

    // console.log("Recent Messages:", messages);

    return NextResponse.json({
      data: response,
      nextCursor: messages.nextCursor,
    });
  } catch (error) {
    console.error("Error fetching emails:", error);

    return NextResponse.json(
      { error: "Error fetching emails" },
      { status: 500 },
    );
  }
}
