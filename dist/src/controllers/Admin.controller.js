"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const Admin_service_1 = require("../services/Admin.service");
const getAdminPanelData = async (req, res) => {
    try {
        const data = await Admin_service_1.AdminService.getAdminPanelData();
        res.status(200).json({
            success: true,
            message: "Admin panel data fetched successfully",
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch admin panel data",
            error: error.message,
        });
    }
};
const createNewInstitution = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password, fullName, totalStudents } = req.body;
        const result = await Admin_service_1.AdminService.createNewInstitution(email, password, fullName, totalStudents);
        res.status(201).json({
            success: true,
            message: "Institution created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create institution",
            error: error.message,
        });
    }
};
exports.AdminController = {
    getAdminPanelData,
    createNewInstitution,
};
