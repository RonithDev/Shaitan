import {authenticateToken} from "../auth/auth.middleware.js";
import {Router} from "express";

import {
    getGroupMessagesController,
    sendMessageController
} from "./message.controller.js";


const router = Router();

router.post(
    "/:groupId", 
    authenticateToken,
    sendMessageController
);

router.get(
  "/:groupId",
  authenticateToken,
  getGroupMessagesController
);

export default router;