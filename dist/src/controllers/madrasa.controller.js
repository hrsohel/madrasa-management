"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.madrasaController = void 0;
const Madrasa_service_1 = require("../services/Madrasa.service");
class MadrasaController {
    async get(req, res, next) {
        try {
            const madrasa = await Madrasa_service_1.madrasaService.get();
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
            const madrasa = await Madrasa_service_1.madrasaService.create(req.body, logoPath);
            res.status(201).json(madrasa);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const logoPath = req.file ? `/uploads/${req.file.filename}` : undefined;
            const madrasa = await Madrasa_service_1.madrasaService.update(req.body, logoPath);
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
exports.madrasaController = new MadrasaController();
