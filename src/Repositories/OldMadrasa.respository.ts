import OldMadrasaInfo, { IOldMadrasaInfo } from "../models/OldMadrasaInfo.model";
import { BaseRepository } from "./BaseRepository";

export class OldMadrasaRepository extends BaseRepository<IOldMadrasaInfo> {
    constructor() {
        super(OldMadrasaInfo)
    }
} 