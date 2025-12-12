import { Request, Response } from "express";
import { AdminService } from "../services/Admin.service";

const getAdminPanelData = async (req: Request, res: Response) => {
  try {
    const data = await AdminService.getAdminPanelData();
    res.status(200).json({
      success: true,
      message: "Admin panel data fetched successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch admin panel data",
      error: error.message,
    });
  }
};

const createNewInstitution = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const { email, password, fullName, totalStudents } = req.body;
    const result = await AdminService.createNewInstitution(
      email,
      password,
      fullName,
      totalStudents
    );
    res.status(201).json({
      success: true,
      message: "Institution created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to create institution",
      error: error.message,
    });
  }
};

export const AdminController = {
  getAdminPanelData,
  createNewInstitution,
};
