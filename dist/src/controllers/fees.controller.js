"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeesController = void 0;
const Fees_service_1 = require("../services/Fees.service");
const feesService = new Fees_service_1.FeesService();
class FeesController {
    async updateFees(req, res, next) {
        try {
            const userId = req.user.id;
            const updatedFees = await feesService.updateFees({
                ...req.body,
                _id: req.params.id,
                userId
            });
            return res.status(200).json({
                status: 200,
                success: true,
                messages: "fees data updated",
                data: updatedFees,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FeesController = FeesController;
