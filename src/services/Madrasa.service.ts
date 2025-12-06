import { OldMadrasaRepository } from '../Repositories/OldMadrasa.respository';
import { IOldMadrasaInfo } from '../models/OldMadrasaInfo.model';

const oldMadrasaRepository = new OldMadrasaRepository()

export class MadrasaService {
    async addMadrasaInfo(bodyData: Partial<IOldMadrasaInfo>) {
        return await oldMadrasaRepository.createDocs(bodyData)
    }
}