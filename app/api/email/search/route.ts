import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Nylas, { type ListMessagesQueryParams } from "nylas";

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY!,
  apiUri: process.env.NYLAS_API_URI!,
});

export async function GET(
  request: Request & NextRequest,
): Promise<NextResponse> {
  try {
    const cookieStore = cookies();

    const userDetails = JSON.parse(cookieStore.get("mailtales_user_details")?.value!);

    const grantId = userDetails.grantId;

    console.log("GrantId:", grantId);

    const queryParams: ListMessagesQueryParams = {
      in: ["INBOX"],
      limit: 5,
    }
    const search = request.nextUrl.searchParams.get("search");

    if (search && search.length > 0) {
      queryParams.searchQueryNative = search;
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
