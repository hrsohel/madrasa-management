"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            // Must return or call next with error to end request-response cycle properly
            res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, "your-secret-key");
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid token.",
        });
        return;
    }
};
exports.verifyToken = verifyToken;
