"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const Madrasa_model_1 = require("../models/Madrasa.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../utils/sendEmail");
const emailTemplates_1 = require("../utils/emailTemplates");
const login = async (email, password) => {
    const user = await User_model_1.default.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role, email: user.email }, process.env.TOKEN_SECRET, {
        expiresIn: "1d",
    });
    return {
        user,
        token,
    };
};
const signUp = async (userData) => {
    const { fullName, email, password, role } = userData;
    const existingUser = await User_model_1.default.findOne({ email });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }
    // The password hashing is now handled by the pre-save hook in the User model
    const newUser = new User_model_1.default({
        fullName,
        email,
        password, // Password will be hashed by the pre-save hook
        role,
    });
    await newUser.save();
    await Madrasa_model_1.Madrasa.create({
        name: {
            bangla: "My Madrasa",
            english: "My Madrasa",
        },
        location: {
            bangla: "Madrasa Location",
            english: "Madrasa Location",
        },
        contact: {
            email: newUser.email,
            phone: "01000000000",
        },
        userId: newUser._id,
    });
    const emailHtml = (0, emailTemplates_1.getWelcomeEmailHtml)(password);
    await (0, sendEmail_1.sendEmail)(newUser.email, "Welcome to Madrasa Management - Your Account Created", `Welcome! Your password is: ${password}`, emailHtml);
    return newUser;
};
const getAllUsers = async () => {
    const users = await User_model_1.default.find().select("-password"); // Exclude password from the results
    return users;
};
const deleteUser = async (userId) => {
    const user = await User_model_1.default.findByIdAndDelete(userId);
    if (!user) {
        throw new Error("User not found");
    }
    await Madrasa_model_1.Madrasa.deleteOne({ userId });
    return user;
};
const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await User_model_1.default.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordMatch = await bcrypt_1.default.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
        throw new Error("Invalid old password");
    }
    // Pre-save hook will hash this
    user.password = newPassword;
    await user.save();
    return { message: "Password changed successfully" };
};
exports.UserService = {
    login,
    signUp,
    getAllUsers,
    deleteUser,
    changePassword,
};
