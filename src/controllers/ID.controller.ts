import { NextFunction, Request, Response } from "express";
import ID from "../models/IDs.model";

export class IDcontroller {
    async updateID(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const data = await ID.findOneAndUpdate(
                { id: "HS" },
                {
                    $set: { id: "HS" }, // Ensure userId is set on insert
                    $inc: { seq: 1 }
                },
                { new: true, upsert: true }
            );
            res.status(201).json({ status: 201, message: "ID", success: true, data })
        } catch (error: unknown) {
            next(error as Error)
        }
    }
}