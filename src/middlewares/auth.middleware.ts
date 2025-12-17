import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend the Request interface locally if global declaration issues arise, 
// though the global type definition is preferred.
export interface CustomRequest extends Request {
    user?: string | JwtPayload;
}

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => { // explicit void return for middleware
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

        const decoded = jwt.verify(token, "your-secret-key");
        (req as CustomRequest).user = decoded;
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid token.",
        });
        return;
    }
};
