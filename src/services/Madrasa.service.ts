import { OldMadrasaRepository } from "../Repositories/OldMadrasa.respository";

const madrasaRepo = new OldMadrasaRepository

export class MadrasaService {
    async addMadrasaInfo(bodyData: any) {
        return await madrasaRepo.createDocs(bodyData)
    }
    
}