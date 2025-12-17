import { NextFunction, Request, Response } from "express";
import { FinancialsService } from "../services/Financials.service";

const financialsService = new FinancialsService();

export class FinancialsController {
    async getFinancialSummary(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req.user as any).id;
            const summary = await financialsService.getFinancialAnalytics(userId);
            return res.status(200).json({
                status: 200,
                success: true,
                messages: "financial summary",
                data: summary
            })
        } catch (error: unknown) {
            next(error as Error)
        }
    }
}