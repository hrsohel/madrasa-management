import { FeesRepository } from "../Repositories/Fees.repository";

const feesRepo = new FeesRepository()

export class FeesService {
    async addFees(bodyData: any) {
        return await feesRepo.createDocs(bodyData)
    }
}