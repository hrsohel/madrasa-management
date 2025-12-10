import Guardian, { IGuardian } from "../models/Guardian.model";
import { BaseRepository } from "./BaseRepository";

export class GuardianRepository extends BaseRepository<IGuardian>{
    constructor() {
        super(Guardian)
    }
    async updateGuardian(bodyData: any) {
        return await Guardian.findOneAndUpdate({_id: bodyData._id}, {$set: bodyData}, {new: true})
    }
}