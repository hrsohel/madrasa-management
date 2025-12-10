import OldMadrasaInfo, { IOldMadrasaInfo } from "../models/OldMadrasaInfo.model";
import { BaseRepository } from "./BaseRepository";

export class OldMadrasaRepository extends BaseRepository<IOldMadrasaInfo> {
    constructor() {
        super(OldMadrasaInfo)
    }
    async updateOldMadrasaInfo(bodyData: any) {
        return await OldMadrasaInfo.findOneAndUpdate({_id: bodyData._id}, {$set: bodyData}, {new: true})
    }
} 