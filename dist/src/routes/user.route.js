"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.post("/login", user_controller_1.UserController.login);
router.post("/logout", user_controller_1.UserController.logout);
router.post("/signup", user_controller_1.UserController.signUp);
router.get("/get-all-users", user_controller_1.UserController.getAllUsers);
exports.UserRoutes = router;
