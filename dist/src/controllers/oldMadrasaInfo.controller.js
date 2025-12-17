"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OldMadrasaInfoController = void 0;
const Madrasa_service_1 = require("../services/Madrasa.service");
const madrasaService = new Madrasa_service_1.MadrasaService();
class OldMadrasaInfoController {
    async addOldMadrasaInfo(req, res, next) {
        try {
            const newOldMadrasaInfo = await madrasaService.addMadrasaInfo(req.body);
            return res.status(201).json({
                status: 201,
                success: true,
                messages: "old madrasa info added",
                data: newOldMadrasaInfo,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateOldMadrasaInfo(req, res, next) {
        try {
            const userId = req.user.id;
            const updatedOldMadrasaInfo = await madrasaService.updateMadrasaInfo({
                ...req.body,
                _id: req.params.id,
                userId,
            });
            return res.status(200).json({
                status: 200,
                success: true,
                messages: "old madrasa info data updated",
                data: updatedOldMadrasaInfo,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OldMadrasaInfoController = OldMadrasaInfoController;
