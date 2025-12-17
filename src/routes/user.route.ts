import express from "express";
import { UserController } from "../controllers/user.controller";

import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/login", UserController.login);
router.post("/logout", verifyToken, UserController.logout);
router.post("/signup", UserController.signUp);
router.get("/get-all-users", verifyToken, UserController.getAllUsers);
router.delete("/delete-user/:id", UserController.deleteUser);
router.post("/change-password", verifyToken, UserController.changePassword);

export const UserRoutes = router;
