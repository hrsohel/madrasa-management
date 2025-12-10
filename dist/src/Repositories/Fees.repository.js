"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeesRepository = void 0;
const Fees_model_1 = __importDefault(require("../models/Fees.model"));
const BaseRepository_1 = require("./BaseRepository");
class FeesRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Fees_model_1.default);
    }
    async updateFees(bodyData) {
        return await Fees_model_1.default.findOneAndUpdate({ _id: bodyData._id }, { $set: bodyData }, { new: true });
    }
}
exports.FeesRepository = FeesRepository;
