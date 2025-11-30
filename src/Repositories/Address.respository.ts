import Address, { IAddress } from "../models/Address.model";
import { BaseRepository } from "./BaseRepository";

export class AddressRepository extends BaseRepository<IAddress> {
   constructor() {
    super(Address)
   }
}