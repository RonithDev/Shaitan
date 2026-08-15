import { prisma } from "../config/database.js";

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });
}