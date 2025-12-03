"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseRepository = void 0;
const Expense_model_1 = __importDefault(require("../models/Expense.model"));
const BaseRepository_1 = require("./BaseRepository");
class ExpenseRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Expense_model_1.default);
    }
}
exports.ExpenseRepository = ExpenseRepository;
