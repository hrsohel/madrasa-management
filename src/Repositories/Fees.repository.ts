import Fees, { IFees } from "../models/Fees.model";
import { BaseRepository } from "./BaseRepository";

export class FeesRepository extends BaseRepository<IFees> {
 constructor() {
    super(Fees)
 }
 async updateFees(bodyData: any) {
    return await Fees.findOneAndUpdate({_id: bodyData._id}, {$set: bodyData}, {new: true})
 }
}