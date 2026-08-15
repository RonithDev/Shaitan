import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware.js";
import { 
  createGroup, 
  addMember, 
  getUserGroups,
  getGroupById,
  removeMember,
  leaveGroup,
  deleteGroup
} from "./group.service.js";

// Handler for group creation requests

export async function createGroupController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Group name is required",
      });
    }

    const group = await createGroup(
      name,
      req.userId!
    );

    return res.status(201).json({
      message: "Group created successfully",
      group,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to create group",
    });
  }
}

//Code for adding a member to a group 

export async function addMemberController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const member = await addMember(groupId as string, userId, req.userId!);

    return res.status(201).json({
      message: "Member added successfully",
      groupId: member.groupId,
      userId: member.userId,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to add member",
    });
  }
}

//Handler for getting all the groups a user is a member of

export async function getUserGroupsController(
  req: AuthRequest,
  res: Response
) {
  try {
    const groups = await getUserGroups(req.userId!);

    return res.status(200).json({
      groups,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to fetch groups",
    });
  }
}

//Handler for getting a specific group by its ID and its members

export async function getGroupController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { groupId } = req.params;

    const group = await getGroupById(groupId as string , req.userId!);

    if (!group) {
      return res.status(404).json({
        message: "Group not found or you are not a member",
      });
    }

    return res.status(200).json({
      group,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to fetch group",
    });
  }
}

//Handler for removing a member from a group

export async function removeMemberController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { groupId, userId } = req.params;

    await removeMember(
      groupId as string,
      userId as string,
      req.userId!
    );

    return res.status(200).json({
      message: "Member removed successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to remove member",
    });
  }
}

//Handler for leaving a group

export async function leaveGroupController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { groupId } = req.params;

    await leaveGroup(
      groupId as string,
      req.userId!
    );

    return res.status(200).json({
      message: "You left the group successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to leave group",
    });
  }
}

//Handler for deleting a group

export async function deleteGroupController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { groupId } = req.params;

    await deleteGroup(
      groupId as string,
      req.userId!
    );

    return res.status(200).json({
      message: "Group deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete group",
    });
  }
}