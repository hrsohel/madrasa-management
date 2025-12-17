import Address, { IAddress } from "../models/Address.model";
import { ClientSession } from "mongoose";
import { BaseRepository } from "./BaseRepository";

export class AddressRepository extends BaseRepository<IAddress> {
   constructor() {
      super(Address)
   }
   async updateAddress(bodyData: any, session?: ClientSession) {
      return await Address.findOneAndUpdate({ _id: bodyData._id }, { $set: bodyData }, { new: true, session })
   }
}