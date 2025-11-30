import Guardian, { IGuardian } from "../models/Guardian.model";
import { BaseRepository } from "./BaseRepository";

export class GuardianRepository extends BaseRepository<IGuardian>{
    constructor() {
        super(Guardian)
    }
}