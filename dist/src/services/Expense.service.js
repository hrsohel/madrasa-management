"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const Expense_repository_1 = require("../Repositories/Expense.repository");
const expenseRepository = new Expense_repository_1.ExpenseRepository();
class ExpenseService {
    async addExpense(bodyData) {
        return await expenseRepository.createDocs(bodyData);
    }
    async getSingleExpense(roshidNo) {
        return await expenseRepository.filterDocs({ roshidNo });
    }
    async getExpenseWithFilters(queryData) {
        const filter = {};
        const andConditions = [];
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
        filter.page = queryData.page;
        filter.limit = queryData.limit;
        return await expenseRepository.filterDocs(filter);
    }
    async totalExpenses(queryData) {
        const filter = {};
        const andConditions = [];
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
        return expenseRepository.totalDocuments(filter);
    }
}
exports.ExpenseService = ExpenseService;
