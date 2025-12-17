import Guardian, { IGuardian } from "../models/Guardian.model";
import { ClientSession } from "mongoose";
import { BaseRepository } from "./BaseRepository";

export class GuardianRepository extends BaseRepository<IGuardian> {
    constructor() {
        super(Guardian)
    }
    async updateGuardian(bodyData: any, session?: ClientSession) {
        return await Guardian.findOneAndUpdate({ _id: bodyData._id }, { $set: bodyData }, { new: true, session })
    }
}