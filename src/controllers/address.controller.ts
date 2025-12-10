import { NextFunction, Request, Response } from "express";
import { AddressService } from "../services/Address.service";

const addressService = new AddressService();

export class AddressController {
  async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedAddress = await addressService.updateAddress({
        ...req.body,
        _id: req.params.id,
      });
      return res.status(200).json({
        status: 200,
        success: true,
        messages: "address data updated",
        data: updatedAddress,
      });
    } catch (error: unknown) {
      next(error as Error);
    }
  }
}
