import { ClientSession } from "mongoose";
import { AddressRepository } from "../Repositories/Address.respository";

const addressRepo = new AddressRepository()

export class AddressService {
    async addAddress(bodyData: any, session?: ClientSession) {
        return await addressRepo.createDocs(bodyData, session)
    }

    async findOneGuardian(any: any) {
        return await addressRepo.findOne(any)
    }

    async updateAddress(bodyData: any) {
        return await addressRepo.updateAddress(bodyData)
    }
}