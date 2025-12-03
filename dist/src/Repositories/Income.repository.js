"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeRespository = void 0;
const Income_model_1 = __importDefault(require("../models/Income.model"));
const BaseRepository_1 = require("./BaseRepository");
class IncomeRespository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Income_model_1.default);
    }
}
exports.IncomeRespository = IncomeRespository;
