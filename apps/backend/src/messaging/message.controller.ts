import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware.js";
import { sendMessage, getGroupMessages } from "./message.service.js";


//Handler for sending a message to a group

export async function sendMessageController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { groupId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

    const message = await sendMessage(
      groupId as string,
      req.userId!,
      content
    );

    return res.status(201).json({
      message: {
        id: message.id,
        groupId: message.groupId,
        senderId: message.senderId,
        content: message.content,
        sequenceNumber: message.sequenceNumber.toString(),
        createdAt: message.createdAt,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to send message",
    });
  }
}

//Handler for getting messages for a group

export async function getGroupMessagesController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { groupId } = req.params;

    const before = req.query.before
      ? BigInt(req.query.before as string)
      : undefined;

    const limit = req.query.limit
      ? Math.min(Number(req.query.limit), 100)
      : 50;

    const messages = await getGroupMessages(
      groupId as string,
      req.userId!,
      before,
      limit
    );

    return res.status(200).json({
      messages: messages.reverse().map((message) => ({
        ...message,
        sequenceNumber: message.sequenceNumber.toString(),
      })),
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch messages",
    });
  }
}