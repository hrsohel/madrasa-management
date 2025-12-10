import { ClientSession } from "mongoose";
import { FeesRepository } from "../Repositories/Fees.repository";

const feesRepo = new FeesRepository()

export class FeesService {
    async addFees(bodyData: any, session?: ClientSession) {
        return await feesRepo.createDocs(bodyData, session)
    }
    async updateFees(bodyData: any) {
        return await feesRepo.updateFees(bodyData)
    }
}