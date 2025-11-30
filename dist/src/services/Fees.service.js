"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeesService = void 0;
const Fees_repository_1 = require("../Repositories/Fees.repository");
const feesRepo = new Fees_repository_1.FeesRepository();
class FeesService {
    async addFees(bodyData) {
        return await feesRepo.createDocs(bodyData);
    }
}
exports.FeesService = FeesService;
