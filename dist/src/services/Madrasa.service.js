"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MadrasaService = void 0;
const OldMadrasa_respository_1 = require("../Repositories/OldMadrasa.respository");
const madrasaRepo = new OldMadrasa_respository_1.OldMadrasaRepository;
class MadrasaService {
    async addMadrasaInfo(bodyData) {
        return await madrasaRepo.createDocs(bodyData);
    }
}
exports.MadrasaService = MadrasaService;
