import express from "express";
import { AdminController } from "../controllers/Admin.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(verifyToken);

router.get("/panel-data", AdminController.getAdminPanelData);
router.post("/create-institution", AdminController.createNewInstitution);

export const AdminRoutes = router;
