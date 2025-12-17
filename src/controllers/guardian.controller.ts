import { NextFunction, Request, Response } from "express";
import { GuardianService } from "../services/Guardian.service";

const guardianService = new GuardianService();

export class GuardianController {
  async updateGuardian(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any).id;
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
    } catch (error: unknown) {
      next(error as Error);
    }
  }
}
