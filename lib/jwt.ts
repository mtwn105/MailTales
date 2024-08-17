import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key";

export interface CustomJwtPayload extends JwtPayload {
  id: string,
  email: string;
}

// Function to sign a JWT
export function signToken(
  payload: CustomJwtPayload,
  expiresIn: string | number = "1h",
): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Function to verify a JWT
export function verifyToken(token: string): CustomJwtPayload | null {
  try {
    return jwt.verify(token, SECRET_KEY) as CustomJwtPayload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

// Function to decode a JWT without verification
export function decodeToken(token: string): CustomJwtPayload | null {
  try {
    return jwt.decode(token) as CustomJwtPayload;
  } catch (err) {
    console.error("JWT decoding failed:", err);
    return null;
  }
}
