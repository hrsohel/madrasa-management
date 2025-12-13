"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrePlannedFeesController = void 0;
const PrePlannedFees_model_1 = require("../models/PrePlannedFees.model");
class PrePlannedFeesController {
    async getAllFees(req, res) {
        try {
            const feeHeads = await PrePlannedFees_model_1.PrePlannedFees.find({})
                .sort({ createdAt: 1 }) // or { name: 1 } for alphabetical
                .lean(); // optional: returns plain JS objects (faster)
            res.status(200).json({
                success: true,
                count: feeHeads.length,
                data: feeHeads,
            });
        }
        catch (error) {
            console.error('Error fetching fee heads:', error);
            res.status(500).json({
                success: false,
                message: 'Server Error',
                error: error.message || 'Unknown error',
            });
        }
    }
}
exports.PrePlannedFeesController = PrePlannedFeesController;
