import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import User from "@/models/User";

// console.log(nylas);

export async function GET(
  _request: Request & NextRequest,
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

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);

    return NextResponse.json(
      { error: "Error fetching user details" },
      { status: 500 },
    );
  }
}
