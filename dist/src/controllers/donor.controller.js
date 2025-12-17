"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonorContoller = void 0;
const Donor_service_1 = require("../services/Donor.service");
const donorService = new Donor_service_1.DonorService();
class DonorContoller {
    async addDonor(req, res, next) {
        try {
            const userId = req.user.id;
            await donorService.addDonor({ ...req.body, userId });
            return res.status(201).json({
                status: 201,
                success: true,
                message: "Donor added",
                data: []
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getDonors(req, res, next) {
        try {
            const userId = req.user.id;
            const donors = await donorService.getFilteredDonor({ ...req.query, userId });
            return res.status(200).json({
                status: 200,
                success: true,
                message: "donors data",
                data: {
                    donors
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DonorContoller = DonorContoller;
