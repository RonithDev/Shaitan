import { Router } from "express";
import { authenticateToken } from "../auth/auth.middleware.js";

import { 
  createGroupController,
  addMemberController,
  getUserGroupsController,
  getGroupController,
  removeMemberController,
  leaveGroupController,
  deleteGroupController
 }
  from "./group.controller.js";


const router = Router();

router.post(
  "/",
  authenticateToken,
  createGroupController
);

router.post(
  "/:groupId/members",
  authenticateToken,
  addMemberController
);

router.get(
  "/",
  authenticateToken,
  getUserGroupsController
);

router.get(
  "/:groupId",
  authenticateToken,
  getGroupController
);

router.delete(
  "/:groupId/members/:userId",
  authenticateToken,
  removeMemberController
);

router.delete(
  "/:groupId/members/me",
  authenticateToken,
  leaveGroupController
);

router.delete(
  "/:groupId",
  authenticateToken,
  deleteGroupController
);
export default router;