import { NextFunction, Request, Response } from "express";
import { MadrasaService } from "../services/Madrasa.service";

const madrasaService = new MadrasaService();

export class OldMadrasaInfoController {
  async updateOldMadrasaInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedOldMadrasaInfo = await madrasaService.updateMadrasaInfo({
        ...req.body,
        _id: req.params.id,
      });
      return res.status(200).json({
        status: 200,
        success: true,
        messages: "old madrasa info data updated",
        data: updatedOldMadrasaInfo,
      });
    } catch (error: unknown) {
      next(error as Error);
    }
  }
}
