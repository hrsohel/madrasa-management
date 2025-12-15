import { ClientSession } from "mongoose";
import { ExpenseRepository } from "../Repositories/Expense.repository";

const expenseRepository = new ExpenseRepository()

export class ExpenseService {
    async addExpense(bodyData: any, session?: ClientSession) {
        return await expenseRepository.createDocs(bodyData, session)
    }

    async getSingleExpense(roshidNo: string) {
        return await expenseRepository.filterDocs({ roshidNo })
    }

    async getExpenseWithFilters(queryData: any) {
        const filter: any = {};
        const andConditions: any[] = [];

        if (queryData.date) {
            andConditions.push({ createdAt: { $lte: new Date(queryData.date) } });
        }
        if (queryData.donorName) {
            andConditions.push({ donorName: queryData.donorName });
        }
        if (queryData.amount) {
            andConditions.push({ amount: queryData.amount });
        }
        if (queryData.sectorName) {
            andConditions.push({ sectorName: queryData.sectorName });
        }
        if (queryData.method) {
            andConditions.push({ method: queryData.method });
        }
        if (queryData.receiptIssuer) {
            andConditions.push({ receiptIssuer: queryData.receiptIssuer });
        }
        if (andConditions.length > 0) {
            filter.$and = andConditions;
        }
        filter.page = queryData.page
        filter.limit = queryData.limit
        return await expenseRepository.filterDocs(filter)
    }

    async totalExpenses(queryData: any) {
        const filter: any = {};
        const andConditions: any[] = [];
        if (queryData.date) {
            andConditions.push({ createdAt: { $lte: new Date(queryData.date) } });
        }
        if (queryData.donorName) {
            andConditions.push({ donorName: queryData.donorName });
        }
        if (queryData.amount) {
            andConditions.push({ amount: queryData.amount });
        }
        if (queryData.sectorName) {
            andConditions.push({ sectorName: queryData.sectorName });
        }
        if (queryData.method) {
            andConditions.push({ method: queryData.method });
        }
        if (queryData.receiptIssuer) {
            andConditions.push({ receiptIssuer: queryData.receiptIssuer });
        }
        if (andConditions.length > 0) {
            filter.$and = andConditions;
        }
        return expenseRepository.totalDocuments(filter)
    }
}