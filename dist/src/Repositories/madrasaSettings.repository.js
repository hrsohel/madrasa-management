"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.madrasaSettingsRepository = void 0;
const Madrasa_model_1 = require("../models/Madrasa.model");
class MadrasaSettingsRepository {
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
    async addFee(feeName, amount) {
        const existing = await this.get();
        if (!existing) {
            throw new Error('Madrasa settings not found. Please create settings first.');
        }
        const updatedFees = { ...existing.fees, [feeName]: amount };
        return Madrasa_model_1.Madrasa.findByIdAndUpdate(existing._id, { $set: { fees: updatedFees } }, { new: true, runValidators: true });
    }
    async removeFee(feeName) {
        const existing = await this.get();
        if (!existing) {
            throw new Error('Madrasa settings not found.');
        }
        const updatedFees = { ...existing.fees };
        delete updatedFees[feeName];
        return Madrasa_model_1.Madrasa.findByIdAndUpdate(existing._id, { $set: { fees: updatedFees } }, { new: true, runValidators: true });
    }
}
exports.madrasaSettingsRepository = new MadrasaSettingsRepository();
