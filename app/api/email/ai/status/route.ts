import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as schema from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

import { db } from "@/lib/db";

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

    return NextResponse.json({
      status: user?.embeddingGenerationStatus,
    });

  } catch (error) {

    console.error("Error fetching email ai status:", error);

    return NextResponse.json(
      { error: "Error fetching email ai status" },
      { status: 500 },
    );
  }
}
