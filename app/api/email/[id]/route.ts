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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const cookieStore = cookies();
    const decoded = verifyToken(
      cookieStore.get("mailtales_user_token")?.value!
    );

    if (!decoded) {
      return new NextResponse(null, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(decoded.id);

    if (!user) {
      return new NextResponse(null, { status: 401 });
    }

    const grantId = user.grantId;
    const emailId = params.id;

    const message = await nylas.messages.find({
      identifier: grantId!,
      messageId: emailId,
    });

    console.log("Found email:", message);

    if (!message.data.body) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: message.data.id,
      subject: message.data.subject,
      from: message.data.from?.[0]?.email,
      to: message.data.to?.[0]?.email,
      date: message.data.date,
      body: message.data.body,
    });
  } catch (error) {
    console.error("Error fetching email:", error);
    return NextResponse.json(
      { error: "Error fetching email" },
      { status: 500 }
    );
  }
}
