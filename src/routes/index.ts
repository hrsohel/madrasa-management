import express from "express";
import { UserRoutes } from "./user.route";
import { StudentRoutes } from "./student.route";
import { AdminRoutes } from "./Admin.route";
import { FeesRoute } from "./prePlannedFees.route"

import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.use("/users", UserRoutes);
router.use("/students", verifyToken, StudentRoutes);
router.use("/admin", verifyToken, AdminRoutes);
router.use("/fees", verifyToken, FeesRoute);

export default router;
