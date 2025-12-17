"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Incomecontroller = void 0;
const Income_service_1 = require("../services/Income.service");
const incomeService = new Income_service_1.IncomeService();
class Incomecontroller {
    async addIncome(req, res, next) {
        try {
            const userId = req.user.id;
            const existIncome = await incomeService.getSingleIncome(req.body.roshidNo);
            if (existIncome.length > 0) {
                return res.status(403).json({
                    status: 403,
                    success: false,
                    message: "Duplicate roshid.",
                    data: []
                });
            }
            await incomeService.addIncome({ ...req.body, userId });
            return res.status(201).json({
                status: 201,
                success: true,
                message: "Income added",
                data: []
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getIncomes(req, res, next) {
        try {
            const userId = req.user.id;
            const [incomes, totalDocuments] = await Promise.all([
                incomeService.getIncomeWithFilters({ ...req.query, userId }),
                incomeService.totalIncomes({ ...req.query, userId })
            ]);
            return res.status(200).json({
                status: 200,
                success: true,
                message: "all income data",
                data: {
                    incomes,
                    totalDocuments,
                    page: Number(req.query.page) || 1
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.Incomecontroller = Incomecontroller;
