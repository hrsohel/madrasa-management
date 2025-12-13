import { Router, Request, Response } from 'express';
import { IFeeHead, PrePlannedFees } from '../models/PrePlannedFees.model';


export class PrePlannedFeesController {
    async getAllFees(req: Request, res: Response) {
        try {
            const feeHeads: IFeeHead[] = await PrePlannedFees.find({})
                .sort({ createdAt: 1 }) // or { name: 1 } for alphabetical
                .lean(); // optional: returns plain JS objects (faster)

            res.status(200).json({
                success: true,
                count: feeHeads.length,
                data: feeHeads,
            });
        } catch (error: any) {
            console.error('Error fetching fee heads:', error);
            res.status(500).json({
                success: false,
                message: 'Server Error',
                error: error.message || 'Unknown error',
            });
        }
    }
}