
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Nylas from "nylas";

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY!,
  apiUri: process.env.NYLAS_API_URI!
})

console.log(nylas)

export async function GET(request: Request & NextRequest): Promise<NextResponse> {
  try {


    // Get the grant ID from the cookie
    const cookieStore = cookies();

    const grantId = cookieStore.get('nylas_grant_id')?.value;

    const messages = await nylas.messages.list({
      identifier: grantId!,
      queryParams: {
        limit: 5,
      }
    });

    console.log('Recent Messages:', messages);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ error: 'Error fetching emails' }, { status: 500 });
  }
}