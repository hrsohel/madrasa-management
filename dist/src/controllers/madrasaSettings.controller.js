"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.madrasaSettingsController = void 0;
const madrasaSettings_service_1 = require("../services/madrasaSettings.service");
class MadrasaSettingsController {
    async get(req, res, next) {
        try {
            const madrasa = await madrasaSettings_service_1.madrasaSettingsService.get();
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
            const logoPath = req.file ? `/uploads/${req.file.filename}` : undefined;
            const madrasa = await madrasaSettings_service_1.madrasaSettingsService.create(req.body, logoPath);
            res.status(201).json(madrasa);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const logoPath = req.file ? `/uploads/${req.file.filename}` : undefined;
            console.log(logoPath);
            const madrasa = await madrasaSettings_service_1.madrasaSettingsService.update(req.body, logoPath);
            if (!madrasa) {
                return res.status(404).json({ message: 'Madrasa not found to update' });
            }
            res.status(200).json(madrasa);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.madrasaSettingsController = new MadrasaSettingsController();
