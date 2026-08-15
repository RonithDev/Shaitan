import { prisma } from "../config/database.js";


// Code for creating a group 
export async function createGroup(
  name: string,
  userId: string
) {
  const group = await prisma.group.create({
    data: {
      name,
      createdById: userId,

      members: {
        create: {
          userId,
        },
      },
    },
  });

  return group;
}

//Code for adding a member to a group
export async function addMember(
  groupId: string,
  userId: string,
  requesterId: string
) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    throw new Error("Group not found");
  }

  if (group.createdById !== requesterId) {
    throw new Error("Only the group creator can add members");
  }

  const existingMember = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
  });

  if (existingMember) {
    throw new Error("User is already a member");
  }

  return prisma.groupMember.create({
    data: {
      groupId,
      userId,
    },
  });
}

///Code for getting all the groups a user is a member of

export async function getUserGroups(userId: string) {
  return prisma.group.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      createdById: true,
      createdAt: true,
    },
  });
}

//Code for getting a specific group by its ID and its members

export async function getGroupById(groupId: string, userId: string) {
  return prisma.group.findUnique({
    where: {
      id: groupId,
      members: {
        some: {
          userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      createdById: true,
      createdAt: true,

      members: {
        select: {
          userId: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

//Code for removing a member from a group

export async function removeMember(
  groupId: string,
  userId: string,
  requesterId: string
) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    throw new Error("Group not found");
  }

  if (group.createdById !== requesterId) {
    throw new Error("Only the group creator can remove members");
  }

  if (userId === group.createdById) {
    throw new Error("Group creator cannot be removed");
  }

  const member = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
  });

  if (!member) {
    throw new Error("User is not a member of this group");
  }

  await prisma.groupMember.delete({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
  });
}

//Code for leaving a group

export async function leaveGroup(
  groupId: string,
  userId: string
) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    throw new Error("Group not found");
  }

  if (group.createdById === userId) {
    throw new Error("Group creator cannot leave the group");
  }

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

  await prisma.groupMember.delete({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
  });
}

//Code for deleting a group (only the creator can delete the group)

export async function deleteGroup(
  groupId: string,
  requesterId: string
) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    throw new Error("Group not found");
  }

  if (group.createdById !== requesterId) {
    throw new Error("Only the group creator can delete the group");
  }

  await prisma.group.delete({
    where: { id: groupId },
  });
}