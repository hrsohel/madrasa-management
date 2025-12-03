import Expense, { IExpense } from "../models/Expense.model";
import { BaseRepository } from "./BaseRepository";

export class ExpenseRepository extends BaseRepository<IExpense> {
    constructor() {
        super(Expense)
    }
}