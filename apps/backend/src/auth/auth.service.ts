import { prisma } from "../config/database.js";
import argon2 from "argon2";

export async function signup(
  username: string,
  email: string,
  password: string
) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { email }
      ]
    }
  });

  if (existingUser) {
    throw new Error("Username or email already exists");
  }

  const passwordHash = await argon2.hash(password);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash
    }
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email
  };
}

export async function login(
  email: string,
  password: string
) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordValid = await argon2.verify(
    user.passwordHash,
    password
  );

  if (!passwordValid) {
    throw new Error("Invalid email or password");
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}