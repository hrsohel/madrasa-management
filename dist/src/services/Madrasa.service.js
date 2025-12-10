"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MadrasaService = void 0;
const OldMadrasa_respository_1 = require("../Repositories/OldMadrasa.respository");
const oldMadrasaRepository = new OldMadrasa_respository_1.OldMadrasaRepository();
class MadrasaService {
    async addMadrasaInfo(bodyData, session) {
        return await oldMadrasaRepository.createDocs(bodyData, session);
    }
    async updateMadrasaInfo(bodyData) {
        return await oldMadrasaRepository.updateOldMadrasaInfo(bodyData);
    }
}
exports.MadrasaService = MadrasaService;
