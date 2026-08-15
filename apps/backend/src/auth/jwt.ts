import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export function generateAccessToken(userId: string) {
  return jwt.sign(
    {
      sub: userId,
    },
    JWT_SECRET as string,
    {
      expiresIn: "15m",
    }
  );
}