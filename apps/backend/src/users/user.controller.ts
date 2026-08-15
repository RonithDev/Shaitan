import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware.js";
import { getUserById } from "./user.service.js";

export async function getMeController(
  req: AuthRequest,
  res: Response
) {
  try {
    const user = await getUserById(req.userId!);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch {
    return res.status(500).json({
      message: "Failed to fetch user",
    });
  }
}