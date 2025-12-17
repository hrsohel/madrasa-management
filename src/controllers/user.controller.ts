import { Request, Response } from "express";
import { UserService } from "../services/User.service";
import { IUser } from "../models/User.model";

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.login(email, password);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(200).json({
      success: false,
      message: "User login failed",
      error: error.message,
    });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    // In a real-world application, you would invalidate the user's token.
    // For this example, we will just send a success message.
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "User logout failed",
      error: error.message,
    });
  }
};

const signUp = async (req: Request, res: Response) => {
  try {
    const userData: IUser = req.body;
    const result = await UserService.signUp(userData);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "User creation failed",
      error: error.message,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await UserService.deleteUser(id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "User deletion failed",
      error: error.message,
    });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old and new passwords are required",
      });
    }

    const result = await UserService.changePassword(userId, oldPassword, newPassword);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Password change failed",
      error: error.message,
    });
  }
};

export const UserController = {
  login,
  logout,
  signUp,
  getAllUsers,
  deleteUser,
  changePassword,
};
