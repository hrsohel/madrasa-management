"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonorRepository = void 0;
const Donor_model_1 = __importDefault(require("../models/Donor.model"));
const BaseRepository_1 = require("./BaseRepository");
class DonorRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Donor_model_1.default);
    }
}
exports.DonorRepository = DonorRepository;
