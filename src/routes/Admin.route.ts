import express from "express";
import { AdminController } from "../controllers/Admin.controller";

const router = express.Router();

router.get("/panel-data", AdminController.getAdminPanelData);
router.post("/create-institution", AdminController.createNewInstitution);

export const AdminRoutes = router;
