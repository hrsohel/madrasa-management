"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressService = void 0;
const Address_respository_1 = require("../Repositories/Address.respository");
const addressRepo = new Address_respository_1.AddressRepository();
class AddressService {
    async addAddress(bodyData) {
        return await addressRepo.createDocs(bodyData);
    }
    async findOneGuardian(any) {
        return await addressRepo.findOne(any);
    }
}
exports.AddressService = AddressService;
