"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialsService = void 0;
const Income_model_1 = __importDefault(require("../models/Income.model"));
const Expense_model_1 = __importDefault(require("../models/Expense.model"));
class FinancialsService {
    async getMonthlySummary() {
        const incomePipeline = [
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    totalIncome: { $sum: "$amount" },
                },
            },
        ];
        const expensePipeline = [
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    totalExpense: { $sum: "$amount" },
                },
            },
        ];
        const incomeSummary = await Income_model_1.default.aggregate(incomePipeline);
        const expenseSummary = await Expense_model_1.default.aggregate(expensePipeline);
        const summaryMap = new Map();
        incomeSummary.forEach((item) => {
            const key = `${item._id.year}-${item._id.month}`;
            if (!summaryMap.has(key)) {
                summaryMap.set(key, { year: item._id.year, month: item._id.month, totalIncome: 0, totalExpense: 0, savings: 0 });
            }
            summaryMap.get(key).totalIncome = item.totalIncome;
        });
        expenseSummary.forEach((item) => {
            const key = `${item._id.year}-${item._id.month}`;
            if (!summaryMap.has(key)) {
                summaryMap.set(key, { year: item._id.year, month: item._id.month, totalIncome: 0, totalExpense: 0, savings: 0 });
            }
            summaryMap.get(key).totalExpense = item.totalExpense;
        });
        const summary = Array.from(summaryMap.values());
        summary.forEach(item => {
            item.savings = item.totalIncome - item.totalExpense;
        });
        return summary;
    }
    async getFinancialAnalytics() {
        const monthlySummary = await this.getMonthlySummary();
        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;
        const currentYearData = monthlySummary.filter(item => item.year === currentYear);
        const previousYearData = monthlySummary.filter(item => item.year === previousYear);
        const currentYearTotalIncome = currentYearData.reduce((acc, item) => acc + item.totalIncome, 0);
        const currentYearTotalExpense = currentYearData.reduce((acc, item) => acc + item.totalExpense, 0);
        const currentYearTotalSavings = currentYearTotalIncome - currentYearTotalExpense;
        const previousYearTotalIncome = previousYearData.reduce((acc, item) => acc + item.totalIncome, 0);
        const previousYearTotalExpense = previousYearData.reduce((acc, item) => acc + item.totalExpense, 0);
        const previousYearTotalSavings = previousYearTotalIncome - previousYearTotalExpense;
        const currentYearAverageIncome = currentYearTotalIncome / (currentYearData.length || 1);
        const currentYearAverageExpense = currentYearTotalExpense / (currentYearData.length || 1);
        const currentYearAverageSavings = currentYearAverageIncome - currentYearAverageExpense;
        return {
            monthlySummary,
            previousYearSummary: {
                totalIncome: previousYearTotalIncome,
                totalExpense: previousYearTotalExpense,
                totalSavings: previousYearTotalSavings,
            },
            currentYearSummary: {
                totalIncome: currentYearTotalIncome,
                totalExpense: currentYearTotalExpense,
                totalSavings: currentYearTotalSavings,
            },
            currentYearAverage: {
                averageIncome: currentYearAverageIncome,
                averageExpense: currentYearAverageExpense,
                averageSavings: currentYearAverageSavings,
            }
        };
    }
}
exports.FinancialsService = FinancialsService;
