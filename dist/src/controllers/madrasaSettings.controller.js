"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.madrasaSettingsController = void 0;
const madrasaSettings_service_1 = require("../services/madrasaSettings.service");
class MadrasaSettingsController {
    async get(req, res, next) {
        try {
            const userId = req.user.id;
            const madrasa = await madrasaSettings_service_1.madrasaSettingsService.get(userId);
            if (!madrasa) {
                return res.status(404).json({ message: 'Madrasa not found' });
            }
            res.status(200).json(madrasa);
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const userId = req.user.id;
            const logoPath = req.file ? `/uploads/${req.file.filename}` : undefined;
            const madrasa = await madrasaSettings_service_1.madrasaSettingsService.create(req.body, logoPath, userId);
            res.status(201).json(madrasa);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const userId = req.user.id;
            const logoPath = req.file ? `/uploads/${req.file.filename}` : undefined;
            console.log(logoPath);
            const madrasa = await madrasaSettings_service_1.madrasaSettingsService.update(req.body, logoPath, userId);
            if (!madrasa) {
                return res.status(404).json({ message: 'Madrasa not found to update' });
            }
            res.status(200).json(madrasa);
        }
        catch (error) {
            next(error);
        }
    }
    async addFee(req, res, next) {
        try {
            const userId = req.user.id;
            const { feeName, amount } = req.body;
            const madrasa = await madrasaSettings_service_1.madrasaSettingsService.addFee(feeName, amount, userId);
            res.status(200).json(madrasa);
        }
        catch (error) {
            next(error);
        }
    }
    async removeFee(req, res, next) {
        try {
            const userId = req.user.id;
            const { feeName } = req.params;
            const madrasa = await madrasaSettings_service_1.madrasaSettingsService.removeFee(feeName, userId);
            res.status(200).json(madrasa);
        }
        catch (error) {
            next(error);
        }
    }
    async getFeeStructure(req, res, next) {
        try {
            const userId = req.user.id;
            const fees = await madrasaSettings_service_1.madrasaSettingsService.getFeeStructure(userId);
            res.status(200).json({
                success: true,
                message: 'Fee structure retrieved successfully',
                data: fees
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.madrasaSettingsController = new MadrasaSettingsController();
