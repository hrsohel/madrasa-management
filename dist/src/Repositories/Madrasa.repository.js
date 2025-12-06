"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.madrasaRepository = void 0;
const Madrasa_model_1 = require("../models/Madrasa.model");
class MadrasaRepository {
    async get() {
        return Madrasa_model_1.Madrasa.findOne();
    }
    async create(data) {
        const existing = await this.get();
        if (existing) {
            throw new Error('A Madrasa entry already exists.');
        }
        return Madrasa_model_1.Madrasa.create(data);
    }
    async update(data) {
        return Madrasa_model_1.Madrasa.findOneAndUpdate({}, data, { new: true, runValidators: true });
    }
}
exports.madrasaRepository = new MadrasaRepository();
