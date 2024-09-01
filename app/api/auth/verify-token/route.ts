import { NextRequest, NextResponse } from "next/server";
import * as schema from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";


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

    const [user] = await db.select().from(schema.user).where(eq(schema.user.email, decoded.email))

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
