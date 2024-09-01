import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import Nylas from "nylas";

import { signToken, decodeNylasToken } from "@/lib/jwt";
import { generateEmailEmbedding } from "@/lib/email";
import { db } from "@/lib/db";
import * as schema from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY!,
  apiUri: process.env.NYLAS_API_URI!,
});

export const dynamic = "force-dynamic"; // defaults to auto

// export const db = drizzle(sql, { schema });

export async function GET(request: Request & NextRequest) {


  const cookieStore = cookies();
  const secret = cookieStore.get("nylas_code_challenge")?.value;

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code") as string;

  const { grantId, email, idToken, accessToken } = await nylas.auth.exchangeCodeForToken({
    clientId: process.env.NYLAS_CLIENT_ID!,
    code,
    redirectUri: process.env.NYLAS_REDIRECT_URI!,
    codeVerifier: secret,
  });

  if (!grantId) {
    return Response.redirect(process.env.FAILURE_REDIRECT_URL!);
  }

  console.log("ID Token", idToken);
  console.log("Access Token", accessToken);

  let userDetails = null;

  if (idToken) {
    userDetails = decodeNylasToken(idToken);
  }

  console.log("User details", userDetails);

  let [user] = await db.select().from(schema.user).where(eq(schema.user.email, email)).limit(1);

  if (!user) {

    [user] = await db.insert(schema.user).values({
      name: userDetails?.name,
      picture: userDetails?.picture,
      email,
      grantId,
      dataLastRefreshed: new Date(),
      embeddingGenerationStatus: 'not_started',
    }).returning();

    console.log("New user created", user);
  } else {
    // Update user
    [user] = await db.update(schema.user)
      .set({
        name: userDetails?.name,
        picture: userDetails?.picture,
        grantId,
        lastLogin: new Date(),
      })
      .where(eq(schema.user.email, email))
      .returning();

    console.log("User updated", user);
  }

  // Set cookies
  cookieStore.set("mailtales_user_email", email);

  // Set JWT Token
  const token = signToken({
    id: user.id,
    email,
  });

  cookieStore.set("mailtales_user_token", token);
  console.log("User set", JSON.stringify(user));
  cookieStore.set("mailtales_user_details", JSON.stringify(user));
  console.log("Token set");

  generateEmailEmbedding(user);

  // Redirect to success page

  return Response.redirect(process.env.SUCCESS_REDIRECT_URL!);
}

