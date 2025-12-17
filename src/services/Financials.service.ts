import Income from "../models/Income.model";
import Expense from "../models/Expense.model";
import { Types } from "mongoose";

export class FinancialsService {
    async getMonthlySummary(userId: string) {
        const incomePipeline = [
            {
                $match: { userId: new Types.ObjectId(userId) }
            },
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
                $match: { userId: new Types.ObjectId(userId) }
            },
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

        const incomeSummary = await Income.aggregate(incomePipeline);
        const expenseSummary = await Expense.aggregate(expensePipeline);

        const summaryMap = new Map<string, { year: number; month: number; totalIncome: number; totalExpense: number; savings: number }>();

        incomeSummary.forEach((item) => {
            const key = `${item._id.year}-${item._id.month}`;
            if (!summaryMap.has(key)) {
                summaryMap.set(key, { year: item._id.year, month: item._id.month, totalIncome: 0, totalExpense: 0, savings: 0 });
            }
            summaryMap.get(key)!.totalIncome = item.totalIncome;
        });

        expenseSummary.forEach((item) => {
            const key = `${item._id.year}-${item._id.month}`;
            if (!summaryMap.has(key)) {
                summaryMap.set(key, { year: item._id.year, month: item._id.month, totalIncome: 0, totalExpense: 0, savings: 0 });
            }
            summaryMap.get(key)!.totalExpense = item.totalExpense;
        });

        const summary = Array.from(summaryMap.values());

        summary.forEach(item => {
            item.savings = item.totalIncome - item.totalExpense;
        })


        return summary;
    }

    async getFinancialAnalytics(userId: string) {
        const monthlySummary = await this.getMonthlySummary(userId);
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
        }
    }
}
