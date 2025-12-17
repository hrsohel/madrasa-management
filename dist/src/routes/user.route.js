"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post("/login", user_controller_1.UserController.login);
router.post("/logout", auth_middleware_1.verifyToken, user_controller_1.UserController.logout);
router.post("/signup", user_controller_1.UserController.signUp);
router.get("/get-all-users", auth_middleware_1.verifyToken, user_controller_1.UserController.getAllUsers);
router.delete("/delete-user/:id", user_controller_1.UserController.deleteUser);
router.post("/change-password", auth_middleware_1.verifyToken, user_controller_1.UserController.changePassword);
exports.UserRoutes = router;
