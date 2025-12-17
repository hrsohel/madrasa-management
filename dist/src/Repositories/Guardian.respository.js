"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardianRepository = void 0;
const Guardian_model_1 = __importDefault(require("../models/Guardian.model"));
const BaseRepository_1 = require("./BaseRepository");
class GuardianRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Guardian_model_1.default);
    }
    async updateGuardian(bodyData, session) {
        return await Guardian_model_1.default.findOneAndUpdate({ _id: bodyData._id }, { $set: bodyData }, { new: true, session });
    }
}
exports.GuardianRepository = GuardianRepository;
