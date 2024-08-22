import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key";

export interface MailTalesJwtPayload extends JwtPayload {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface NylasJwtPayload extends JwtPayload {
  email: string;
  family_name: string;
  given_name: string;
  name: string;
  picture: string;
}

// Function to sign a JWT
export function signToken(
  payload: JwtPayload,
  expiresIn: string | number = "24h",
): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Function to verify a JWT
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (err) {
    console.error("JWT verification failed:", err);

    return null;
  }
}

// Function to decode a JWT without verification
export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (err) {
    console.error("JWT decoding failed:", err);

    return null;
  }
}

export function decodeNylasToken(token: string): NylasJwtPayload | null {
  try {
    return jwt.decode(token) as NylasJwtPayload;
  } catch (err) {
    console.error("JWT decoding failed:", err);

    return null;
  }
}
