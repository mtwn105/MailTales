import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as schema from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

import { db } from "@/lib/db";
import { generateEmailEmbedding } from "@/lib/email";

export async function GET(
  request: Request & NextRequest,
): Promise<NextResponse> {
  try {
    const cookieStore = cookies();

    const userDetails = JSON.parse(cookieStore.get("mailtales_user_details")?.value!);

    const [user] = await db.select().from(schema.user).where(eq(schema.user.id, userDetails.id))

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );
    }

    await generateEmailEmbedding(user);

    return NextResponse.json({
      message: "Email embedding generation started",
    });

  } catch (error) {

    console.error("Error fetching email ai status:", error);

    return NextResponse.json(
      { error: "Error fetching email ai status" },
      { status: 500 },
    );
  }
}
