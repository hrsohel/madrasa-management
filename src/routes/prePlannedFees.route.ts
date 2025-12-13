import express from "express";
import { PrePlannedFeesController } from "../controllers/preplannedfees.controller";
const prePlannedControlller =new PrePlannedFeesController()

const router = express.Router();

router.get("/", prePlannedControlller.getAllFees);

export const FeesRoute = router;
