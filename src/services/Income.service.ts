import { IncomeRespository } from "../Repositories/Income.repository"

const incomeRepository = new IncomeRespository()

export class IncomeService {
    async addIncome(bodyData: any) {
        return await incomeRepository.createDocs(bodyData)
    }

    async getSingleIncome(roshidNo: string) {
        return await incomeRepository.filterDocs({roshidNo})
    } 

    async getIncomeWithFilters(queryData: any) {
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
        return await incomeRepository.filterDocs(filter)
    }

    async totalIncomes(queryData: any) {
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
        return incomeRepository.totalDocuments(filter)
    }
}