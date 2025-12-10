import { NextFunction, Request, Response } from "express";
import { FeesService } from "../services/Fees.service";

const feesService = new FeesService();

export class FeesController {
  async updateFees(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedFees = await feesService.updateFees({
        ...req.body,
        _id: req.params.id,
      });
      return res.status(200).json({
        status: 200,
        success: true,
        messages: "fees data updated",
        data: updatedFees,
      });
    } catch (error: unknown) {
      next(error as Error);
    }
  }
}
