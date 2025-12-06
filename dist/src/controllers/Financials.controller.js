"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialsController = void 0;
const Financials_service_1 = require("../services/Financials.service");
const financialsService = new Financials_service_1.FinancialsService();
class FinancialsController {
    async getFinancialSummary(req, res, next) {
        try {
            const summary = await financialsService.getFinancialAnalytics();
            return res.status(200).json({
                status: 200,
                success: true,
                messages: "financial summary",
                data: summary
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FinancialsController = FinancialsController;
