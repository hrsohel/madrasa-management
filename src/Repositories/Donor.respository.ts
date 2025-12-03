import Donor, { IDonor } from "../models/Donor.model";
import { BaseRepository } from "./BaseRepository";

export class DonorRepository extends BaseRepository<IDonor> {
    constructor(){
        super(Donor)
    }
}