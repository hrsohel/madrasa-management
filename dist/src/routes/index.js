"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("./user.route");
const student_route_1 = require("./student.route");
const Admin_route_1 = require("./Admin.route");
const prePlannedFees_route_1 = require("./prePlannedFees.route");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.use("/users", user_route_1.UserRoutes);
router.use("/students", auth_middleware_1.verifyToken, student_route_1.StudentRoutes);
router.use("/admin", auth_middleware_1.verifyToken, Admin_route_1.AdminRoutes);
router.use("/fees", auth_middleware_1.verifyToken, prePlannedFees_route_1.FeesRoute);
exports.default = router;
