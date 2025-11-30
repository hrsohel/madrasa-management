"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardianService = void 0;
const Guardian_respository_1 = require("../Repositories/Guardian.respository");
const guardianService = new Guardian_respository_1.GuardianRepository();
class GuardianService {
    async addGuardian(bodyData) {
        return await guardianService.createDocs(bodyData);
    }
    async findOneGuardian(any) {
        return await guardianService.findOne(any);
    }
}
exports.GuardianService = GuardianService;
