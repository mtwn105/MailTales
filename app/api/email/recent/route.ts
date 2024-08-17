import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Nylas from "nylas";

import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import User from "@/models/User";

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY!,
  apiUri: process.env.NYLAS_API_URI!,
});

// console.log(nylas);

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
      return NextResponse.json({ status: 401 });
    }

    // Fetch user from database
    await connectToDatabase();
    const user = await User.findById(decoded.id);

    console.log("User:", user);

    if (!user) {
      return NextResponse.json({ status: 401 });
    }

    // Get GrantId
    const grantId = user.grantId;

    console.log("GrantId:", grantId);

    const messages = await nylas.messages.list({
      identifier: grantId!,
      queryParams: {
        limit: 5,
      },
    });

    // console.log("Recent Messages:", messages);

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching emails:", error);

    return NextResponse.json(
      { error: "Error fetching emails" },
      { status: 500 },
    );
  }
}
