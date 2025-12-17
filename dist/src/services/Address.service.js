"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressService = void 0;
const Address_respository_1 = require("../Repositories/Address.respository");
const addressRepo = new Address_respository_1.AddressRepository();
class AddressService {
    async addAddress(bodyData, session) {
        return await addressRepo.createDocs(bodyData, session);
    }
    async findOneGuardian(any) {
        return await addressRepo.findOne(any);
    }
    async updateAddress(bodyData, session) {
        return await addressRepo.updateAddress(bodyData, session);
    }
}
exports.AddressService = AddressService;
