import { Router } from "express";
import { authenticateToken } from "../auth/auth.middleware.js";
import { getMeController } from "./user.controller.js";

const router = Router();

router.get(
  "/me",
  authenticateToken,
  getMeController
);

export default router;