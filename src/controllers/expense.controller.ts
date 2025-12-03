import { NextFunction, Request, Response } from "express"
import { ExpenseService } from "../services/Expense.service"

const expenseService = new ExpenseService()

export class ExpenseController {
    async addeExpense(req: Request, res: Response, next: NextFunction) {
            try {
                const existIncome = await expenseService.getSingleExpense(req.body.roshidNo)
                if (existIncome.length > 0) {
                    return res.status(403).json({
                        status: 403,
                        success: false,
                        message: "Duplicate roshid.",
                        data: []
                    })
                }
                await expenseService.addExpense(req.body)
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
    
        async getExpenses(req: Request, res: Response, next: NextFunction) {
            try {
                const [incomes, totalDocuments] = await Promise.all([
                    expenseService.getExpenseWithFilters(req.query),
                    expenseService.totalExpenses(req.query)
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