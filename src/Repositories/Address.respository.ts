import Address, { IAddress } from "../models/Address.model";
import { BaseRepository } from "./BaseRepository";

export class AddressRepository extends BaseRepository<IAddress> {
   constructor() {
    super(Address)
   }
   async updateAddress(bodyData: any) {
    return await Address.findOneAndUpdate({_id: bodyData._id}, {$set: bodyData}, {new: true})
   }
}