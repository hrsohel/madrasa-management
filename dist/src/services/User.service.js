"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = async (email, password) => {
    const user = await User_model_1.default.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordMatch = await bcrypt_1.default.compare(password, user.password);
    console.log(user.password, password, isPasswordMatch);
    if (!isPasswordMatch) {
        throw new Error("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, "your-secret-key", {
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
    return newUser;
};
const getAllUsers = async () => {
    const users = await User_model_1.default.find().select("-password"); // Exclude password from the results
    return users;
};
exports.UserService = {
    login,
    signUp,
    getAllUsers,
};
