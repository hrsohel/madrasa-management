import express from "express";
import { UserController } from "../controllers/user.controller";

const router = express.Router();

router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.post("/signup", UserController.signUp);
router.get("/get-all-users", UserController.getAllUsers);

export const UserRoutes = router;
