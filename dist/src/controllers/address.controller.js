"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressController = void 0;
const Address_service_1 = require("../services/Address.service");
const addressService = new Address_service_1.AddressService();
class AddressController {
    async updateAddress(req, res, next) {
        try {
            const userId = req.user.id;
            const updatedAddress = await addressService.updateAddress({
                ...req.body,
                _id: req.params.id,
                userId,
            });
            return res.status(200).json({
                status: 200,
                success: true,
                messages: "address data updated",
                data: updatedAddress,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AddressController = AddressController;
