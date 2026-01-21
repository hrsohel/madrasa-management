import { Request, Response, NextFunction } from 'express';
import { madrasaSettingsService } from '../services/madrasaSettings.service';

class MadrasaSettingsController {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any).id;
      const madrasa = await madrasaSettingsService.get(userId);
      if (!madrasa) {
        return res.status(404).json({ message: 'Madrasa not found' });
      }
      res.status(200).json(madrasa);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any).id;
      const logoPath = (req as any).file ? `/uploads/${(req as any).file.filename}` : undefined;
      const madrasa = await madrasaSettingsService.create(req.body, logoPath, userId);
      res.status(201).json(madrasa);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any).id;
      const logoPath = (req as any).file ? `/uploads/${(req as any).file.filename}` : undefined;
      console.log(logoPath)
      const madrasa = await madrasaSettingsService.update(req.body, logoPath, userId);
      if (!madrasa) {
        return res.status(404).json({ message: 'Madrasa not found to update' });
      }
      res.status(200).json(madrasa);
    } catch (error) {
      next(error);
    }
  }

  async addFee(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any).id;
      const { feeName, amount } = req.body;
      const madrasa = await madrasaSettingsService.addFee(feeName, amount, userId);
      res.status(200).json(madrasa);
    } catch (error) {
      next(error);
    }
  }

  async removeFee(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any).id;
      const { feeName } = req.params;
      const madrasa = await madrasaSettingsService.removeFee(feeName, userId);
      res.status(200).json(madrasa);
    } catch (error) {
      next(error);
    }
  }

  async getFeeStructure(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any).id;
      const fees = await madrasaSettingsService.getFeeStructure(userId);
      res.status(200).json({
        success: true,
        message: 'Fee structure retrieved successfully',
        data: fees
      });
    } catch (error) {
      next(error);
    }
  }
}

export const madrasaSettingsController = new MadrasaSettingsController();
