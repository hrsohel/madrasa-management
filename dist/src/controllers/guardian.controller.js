"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardianController = void 0;
const Guardian_service_1 = require("../services/Guardian.service");
const guardianService = new Guardian_service_1.GuardianService();
class GuardianController {
    async updateGuardian(req, res, next) {
        try {
            const userId = req.user.id;
            const updatedGuardian = await guardianService.updateGuardian({
                ...req.body,
                _id: req.params.id,
                userId,
            });
            return res.status(200).json({
                status: 200,
                success: true,
                messages: "guardian data updated",
                data: updatedGuardian,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.GuardianController = GuardianController;
