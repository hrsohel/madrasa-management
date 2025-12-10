import { ClientSession } from "mongoose";
import { GuardianRepository } from "../Repositories/Guardian.respository";

const guardianService = new GuardianRepository()

export class GuardianService {
    async addGuardian(bodyData: any, session?: ClientSession) {
        return await guardianService.createDocs(bodyData, session)
    }
    async findOneGuardian(any: any) {
        return await guardianService.findOne(any)
    }

    async updateGuardian(bodyData: any) {
        return await guardianService.updateGuardian(bodyData)
    }
}