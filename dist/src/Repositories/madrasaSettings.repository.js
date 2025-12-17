"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.madrasaSettingsRepository = void 0;
const Madrasa_model_1 = require("../models/Madrasa.model");
class MadrasaSettingsRepository {
    async get(userId) {
        return Madrasa_model_1.Madrasa.findOne({ userId });
    }
    async create(data, userId) {
        const existing = await this.get(userId);
        if (existing) {
            throw new Error('A Madrasa entry already exists for this user.');
        }
        return Madrasa_model_1.Madrasa.create({ ...data, userId });
    }
    async update(data, userId) {
        return Madrasa_model_1.Madrasa.findOneAndUpdate({ userId }, data, { new: true, runValidators: true });
    }
    async addFee(feeName, amount, userId) {
        const existing = await this.get(userId);
        if (!existing) {
            throw new Error('Madrasa settings not found. Please create settings first.');
        }
        const updatedFees = { ...existing.fees, [feeName]: amount };
        return Madrasa_model_1.Madrasa.findOneAndUpdate({ userId }, { $set: { fees: updatedFees } }, { new: true, runValidators: true });
    }
    async removeFee(feeName, userId) {
        const existing = await this.get(userId);
        if (!existing) {
            throw new Error('Madrasa settings not found.');
        }
        const updatedFees = { ...existing.fees };
        delete updatedFees[feeName];
        return Madrasa_model_1.Madrasa.findOneAndUpdate({ userId }, { $set: { fees: updatedFees } }, { new: true, runValidators: true });
    }
}
exports.madrasaSettingsRepository = new MadrasaSettingsRepository();
