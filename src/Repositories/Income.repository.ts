import Income, { IIncome } from "../models/Income.model";
import { BaseRepository } from "./BaseRepository";

export class IncomeRespository extends BaseRepository<IIncome> {
    constructor(){
        super(Income)
    }
}