import { GuardianRepository } from "../Repositories/Guardian.respository";

const guardianService = new GuardianRepository()

export class GuardianService {
    async addGuardian(bodyData: any) {
        return await guardianService.createDocs(bodyData)
    }
    async findOneGuardian(any: any) {
        return await guardianService.findOne(any)
    }
}