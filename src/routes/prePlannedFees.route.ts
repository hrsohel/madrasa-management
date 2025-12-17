import express from "express";
import { PrePlannedFeesController } from "../controllers/preplannedfees.controller";
import { verifyToken } from "../middlewares/auth.middleware";
const prePlannedControlller = new PrePlannedFeesController()

const router = express.Router();

router.use(verifyToken);

router.get("/", prePlannedControlller.getAllFees);

export const FeesRoute = router;
