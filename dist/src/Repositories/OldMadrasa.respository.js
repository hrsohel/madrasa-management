"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OldMadrasaRepository = void 0;
const OldMadrasaInfo_model_1 = __importDefault(require("../models/OldMadrasaInfo.model"));
const BaseRepository_1 = require("./BaseRepository");
class OldMadrasaRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(OldMadrasaInfo_model_1.default);
    }
}
exports.OldMadrasaRepository = OldMadrasaRepository;
