import { ClientSession } from 'mongoose';
import { OldMadrasaRepository } from '../Repositories/OldMadrasa.respository';
import { IOldMadrasaInfo } from '../models/OldMadrasaInfo.model';

const oldMadrasaRepository = new OldMadrasaRepository()

export class MadrasaService {
    async addMadrasaInfo(bodyData: Partial<IOldMadrasaInfo>, session?: ClientSession) {
        return await oldMadrasaRepository.createDocs(bodyData, session)
    }
    async updateMadrasaInfo(bodyData: any, session?: ClientSession) {
        return await oldMadrasaRepository.updateOldMadrasaInfo(bodyData, session)
    }
}