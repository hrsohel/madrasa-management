import { NextFunction, Request, Response } from "express";
import { MadrasaService } from "../services/Madrasa.service";

const madrasaService = new MadrasaService();

export class OldMadrasaInfoController {
  async addOldMadrasaInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const newOldMadrasaInfo = await madrasaService.addMadrasaInfo(req.body);
      return res.status(201).json({
        status: 201,
        success: true,
        messages: "old madrasa info added",
        data: newOldMadrasaInfo,
      });
    } catch (error: unknown) {
      next(error as Error);
    }
  }

  async updateOldMadrasaInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any).id;
      const updatedOldMadrasaInfo = await madrasaService.updateMadrasaInfo({
        ...req.body,
        _id: req.params.id,
        userId,
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
