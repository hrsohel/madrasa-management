import { NextFunction, Request, Response } from "express";
import { DonorService } from "../services/Donor.service";

const donorService = new DonorService()

export class DonorContoller {
    async addDonor(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req.user as any).id;
            await donorService.addDonor({ ...req.body, userId })
            return res.status(201).json({
                status: 201,
                success: true,
                message: "Donor added",
                data: []
            })
        } catch (error: unknown) {
            next(error as Error)
        }
    }

    async getDonors(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req.user as any).id;
            const donors = await donorService.getFilteredDonor({ ...req.query, userId })
            return res.status(200).json({
                status: 200,
                success: true,
                message: "donors data",
                data: {
                    donors
                }
            })
        } catch (error: unknown) {
            next(error as Error)
        }
    }
}