import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import User from "@/models/User";


export async function POST(
  request: Request & NextRequest,
): Promise<NextResponse> {
  try {

    const { token } = await request.json();

    const decoded = verifyToken(token);

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

    return NextResponse.json({
      data: user,
    });
  } catch (error) {
    console.error("Error verifying token:", error);

    return NextResponse.json(
      { error: "Error verifying token" },
      { status: 500 },
    );
  }
}
