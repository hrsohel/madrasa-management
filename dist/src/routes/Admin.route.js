"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Admin_controller_1 = require("../controllers/Admin.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.verifyToken);
router.get("/panel-data", Admin_controller_1.AdminController.getAdminPanelData);
router.post("/create-institution", Admin_controller_1.AdminController.createNewInstitution);
exports.AdminRoutes = router;
