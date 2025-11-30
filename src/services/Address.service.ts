import { AddressRepository } from "../Repositories/Address.respository";

const addressRepo = new AddressRepository()

export class AddressService {
    async addAddress(bodyData: any) {
        return await addressRepo.createDocs(bodyData)
    }

    async findOneGuardian(any: any) {
        return await addressRepo.findOne(any)
    }
}