"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeesService = void 0;
const Fees_repository_1 = require("../Repositories/Fees.repository");
const feesRepo = new Fees_repository_1.FeesRepository();
class FeesService {
    async addFees(bodyData, session) {
        return await feesRepo.createDocs(bodyData, session);
    }
    async updateFees(bodyData) {
        return await feesRepo.updateFees(bodyData);
    }
}
exports.FeesService = FeesService;
