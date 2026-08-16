import {prisma} from '../config/database.js';

export async function sendMessage(
  groupId: string,
  senderId: string,
  content: string
) {
  const member = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId: senderId,
      },
    },
  });

  if (!member) {
    throw new Error("You are not a member of this group");
  }

  const lastMessage = await prisma.message.findFirst({
    where: { groupId },
    orderBy: {
      sequenceNumber: "desc",
    },
  });

  const nextSequence = lastMessage
    ? lastMessage.sequenceNumber + BigInt(1)
    : BigInt(1);

  return prisma.message.create({
    data: {
      groupId,
      senderId,
      content,
      sequenceNumber: nextSequence,
    },
  });
}



//Code to retrieve messages for a group

export async function getGroupMessages(
  groupId: string,
  userId: string,
  before?: bigint,
  limit: number = 50
) {
  const member = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
  });

  if (!member) {
    throw new Error("You are not a member of this group");
  }

  return prisma.message.findMany({
    where: {
      groupId,
      ...(before !== undefined && {
        sequenceNumber: {
          lt: before,
        },
      }),
    },
    orderBy: {
      sequenceNumber: "desc",
    },
    take: limit,
    select: {
      id: true,
      groupId: true,
      senderId: true,
      content: true,
      sequenceNumber: true,
      createdAt: true,
    },
  });
}