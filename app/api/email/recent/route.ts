import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getEmails } from "@/lib/email";

export async function GET(
  request: Request & NextRequest,
): Promise<NextResponse> {
  try {
    const cookieStore = cookies();

    const userDetails = JSON.parse(cookieStore.get("mailtales_user_details")?.value!);

    const grantId = userDetails.grantId;

    const pageToken = request.nextUrl.searchParams.get("pageToken");

    const messages = await getEmails(grantId, 5, pageToken);

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
