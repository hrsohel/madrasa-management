import Fees, { IFees } from "../models/Fees.model";
import { BaseRepository } from "./BaseRepository";

export class FeesRepository extends BaseRepository<IFees> {
 constructor() {
    super(Fees)
 }
}