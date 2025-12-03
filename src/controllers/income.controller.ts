import { NextFunction, Request, Response } from "express";
import { IncomeService } from "../services/Income.service";

const incomeService = new IncomeService()

export class Incomecontroller {
    async addIncome(req: Request, res: Response, next: NextFunction) {
        try {
            const existIncome = await incomeService.getSingleIncome(req.body.roshidNo)
            if (existIncome.length > 0) {
                return res.status(403).json({
                    status: 403,
                    success: false,
                    message: "Duplicate roshid.",
                    data: []
                })
            }
            await incomeService.addIncome(req.body)
            return res.status(201).json({
                status: 201,
                success: true,
                message: "Income added",
                data: []
            })
        } catch (error: unknown) {
            next(error as Error)
        }
    }

    async getIncomes(req: Request, res: Response, next: NextFunction) {
        try {
            const [incomes, totalDocuments] = await Promise.all([
                incomeService.getIncomeWithFilters(req.query),
                incomeService.totalIncomes(req.query)
            ])
            return res.status(200).json({
                status: 200,
                success: true,
                message: "all income data",
                data: {
                    incomes,
                    totalDocuments,
                    page: Number(req.query.page) || 1
                }
            })
        } catch (error: unknown) {
            next(error as Error)
        }
    }
}