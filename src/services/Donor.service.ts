import { DonorRepository } from "../Repositories/Donor.respository"

const donorRepository = new DonorRepository()

export class DonorService {
    async addDonor(bodyData: any) {
        return await donorRepository.createDocs(bodyData)
    } 

    async getFilteredDonor(filter: any) {
        return await donorRepository.filterDocs(filter)
    }

    async getTotalDocuments(filter: any) {
        return await donorRepository.totalDocuments(filter)
    }
}