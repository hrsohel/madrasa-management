"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../models/User.model"));
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                status: "fail",
                error: "You are not logged in",
            });
        }
        // Check if env secret exists
        if (!process.env.TOKEN_SECRET) {
            throw new Error("TOKEN_SECRET is not defined in environment variables");
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        // Optional: Check if user still exists in DB
        const user = await User_model_1.default.findOne({ email: decoded.email });
        if (!user) {
            return res.status(401).json({
                status: "fail",
                error: "User no longer exists",
            });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({
            status: "fail",
            error: "Invalid token",
        });
    }
};
exports.verifyToken = verifyToken;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                status: "fail",
                error: "You are not authorized to access this route",
            });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
