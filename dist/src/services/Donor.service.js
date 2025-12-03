"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonorService = void 0;
const Donor_respository_1 = require("../Repositories/Donor.respository");
const donorRepository = new Donor_respository_1.DonorRepository();
class DonorService {
    async addDonor(bodyData) {
        return await donorRepository.createDocs(bodyData);
    }
    async getFilteredDonor(filter) {
        return await donorRepository.filterDocs(filter);
    }
    async getTotalDocuments(filter) {
        return await donorRepository.totalDocuments(filter);
    }
}
exports.DonorService = DonorService;
