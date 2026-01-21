import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../constants/user.constants";
import User from "../models/User.model";

// Extend Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: "fail",
                error: "You are not logged in",
            });
        }
        if (!process.env.TOKEN_SECRET) {
            console.error("TOKEN_SECRET is missing from .env");
            throw new Error("TOKEN_SECRET is not defined in environment variables");
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET) as JwtPayload;

        // Optional: Check if user still exists in DB
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(401).json({
                status: "fail",
                error: "User no longer exists",
            });
        }
        req.user = decoded;
        next();
    } catch (error: any) {
        console.error("Auth Error:", error.message);
        res.status(403).json({
            status: "fail",
            error: error.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
        });
    }
};

export const authorizeRoles = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                status: "fail",
                error: "You are not authorized to access this route",
            });
        }
        next();
    };
};
