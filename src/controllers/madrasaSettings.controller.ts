import { Request, Response, NextFunction } from 'express';
import { madrasaSettingsService } from '../services/madrasaSettings.service';

class MadrasaSettingsController {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const madrasa = await madrasaSettingsService.get();
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
      const logoPath = (req as any).file ? `/uploads/${(req as any).file.filename}` : undefined;
      const madrasa = await madrasaSettingsService.create(req.body, logoPath);
      res.status(201).json(madrasa);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const logoPath = (req as any).file ? `/uploads/${(req as any).file.filename}` : undefined;
      console.log(logoPath)
      const madrasa = await madrasaSettingsService.update(req.body, logoPath);
      if (!madrasa) {
        return res.status(404).json({ message: 'Madrasa not found to update' });
      }
      res.status(200).json(madrasa);
    } catch (error) {
      next(error);
    }
  }
}

export const madrasaSettingsController = new MadrasaSettingsController();
