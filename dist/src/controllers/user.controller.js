"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_service_1 = require("../services/User.service");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await User_service_1.UserService.login(email, password);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(200).json({
            success: false,
            message: "User login failed",
            error: error.message,
        });
    }
};
const logout = async (req, res) => {
    try {
        // In a real-world application, you would invalidate the user's token.
        // For this example, we will just send a success message.
        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "User logout failed",
            error: error.message,
        });
    }
};
const signUp = async (req, res) => {
    try {
        const userData = req.body;
        const result = await User_service_1.UserService.signUp(userData);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "User creation failed",
            error: error.message,
        });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await User_service_1.UserService.getAllUsers();
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message,
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User_service_1.UserService.deleteUser(id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "User deletion failed",
            error: error.message,
        });
    }
};
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Old and new passwords are required",
            });
        }
        const result = await User_service_1.UserService.changePassword(userId, oldPassword, newPassword);
        res.status(200).json({
            success: true,
            message: "Password changed successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Password change failed",
            error: error.message,
        });
    }
};
exports.UserController = {
    login,
    logout,
    signUp,
    getAllUsers,
    deleteUser,
    changePassword,
};
