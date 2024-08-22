import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import Nylas from "nylas";

import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { signToken, decodeNylasToken } from "@/lib/jwt";

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY!,
  apiUri: process.env.NYLAS_API_URI!,
});

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: Request & NextRequest) {
  const cookieStore = cookies();
  const secret = cookieStore.get("nylas_code_challenge")?.value;

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code") as string;

  const { grantId, email, idToken } = await nylas.auth.exchangeCodeForToken({
    clientId: process.env.NYLAS_CLIENT_ID!,
    code,
    redirectUri: process.env.NYLAS_REDIRECT_URI!,
    codeVerifier: secret,
  });

  if (!grantId) {
    return Response.redirect(process.env.FAILURE_REDIRECT_URL!);
  }

  // Check if user already exists
  await connectToDatabase();

  let user = await User.findOne({ email });

  console.log("ID Token", idToken);

  let userDetails = null;

  if (idToken) {
    userDetails = decodeNylasToken(idToken);
  }

  if (!user) {
    // Create new user
    user = await User.create({
      name: userDetails?.name,
      picture: userDetails?.picture,
      email,
      grantId,
      lastLogin: new Date(),
    });
    console.log("New user created");
  } else {
    // Update user
    user = await User.findOneAndUpdate(
      { email },
      {
        name: userDetails?.name,
        picture: userDetails?.picture,
        grantId,
        lastLogin: new Date(),
      },
    );
    console.log("User updated");
  }

  // Set cookies
  cookieStore.set("mailtales_user_email", email);

  // Set JWT Token
  const token = signToken({
    id: user._id,
    email,
    name: user.name,
    picture: user.picture,
  });

  cookieStore.set("mailtales_user_token", token);
  console.log("User set", JSON.stringify(user));
  cookieStore.set("mailtales_user_details", JSON.stringify(user));
  console.log("Token set");

  // Redirect to success page

  return Response.redirect(process.env.SUCCESS_REDIRECT_URL!);
}
