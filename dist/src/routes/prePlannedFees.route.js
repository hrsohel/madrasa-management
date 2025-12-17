"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeesRoute = void 0;
const express_1 = __importDefault(require("express"));
const preplannedfees_controller_1 = require("../controllers/preplannedfees.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const prePlannedControlller = new preplannedfees_controller_1.PrePlannedFeesController();
const router = express_1.default.Router();
router.use(auth_middleware_1.verifyToken);
router.get("/", prePlannedControlller.getAllFees);
exports.FeesRoute = router;
