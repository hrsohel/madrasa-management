"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeService = void 0;
const Income_repository_1 = require("../Repositories/Income.repository");
const incomeRepository = new Income_repository_1.IncomeRespository();
class IncomeService {
    async addIncome(bodyData) {
        return await incomeRepository.createDocs(bodyData);
    }
    async getSingleIncome(roshidNo) {
        return await incomeRepository.filterDocs({ roshidNo });
    }
    async getIncomeWithFilters(queryData) {
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
        return await incomeRepository.filterDocs(filter);
    }
    async totalIncomes(queryData) {
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
        return incomeRepository.totalDocuments(filter);
    }
}
exports.IncomeService = IncomeService;
