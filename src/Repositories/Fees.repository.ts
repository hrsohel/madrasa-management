import { ClientSession } from "mongoose";
import Fees, { IFees } from "../models/Fees.model";
import { BaseRepository } from "./BaseRepository";

export class FeesRepository extends BaseRepository<IFees> {
   constructor() {
      super(Fees)
   }
   async updateFees(bodyData: any, session?: ClientSession) {
      const doc = await Fees.findById(bodyData._id).session(session || null);
      if (!doc) return null;
      Object.assign(doc, bodyData);
      return await doc.save({ session });
   }
}