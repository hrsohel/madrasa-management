import { IMadrasa } from '../models/Madrasa.model';
import { madrasaSettingsRepository } from '../Repositories/madrasaSettings.repository';
import fs from 'fs';
import path from 'path';

class MadrasaSettingsService {
  async get(userId: string) {
    return madrasaSettingsRepository.get(userId);
  }

  async create(data: Partial<IMadrasa>, logoPath: string | undefined, userId: string) {
    if (logoPath) {
      data.logo = logoPath;
    }
    return madrasaSettingsRepository.create(data, userId);
  }

  async update(data: Partial<IMadrasa>, logoPath: string | undefined, userId: string) {
    const existingMadrasa = await madrasaSettingsRepository.get(userId);

    if (logoPath && existingMadrasa && existingMadrasa.logo) {
      const oldLogoPath = path.join(__dirname, '../../', existingMadrasa.logo);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    if (logoPath) {
      data.logo = logoPath;
    }

    return madrasaSettingsRepository.update(data, userId);
  }

  async addFee(feeName: string, amount: number, userId: string) {
    if (!feeName || typeof feeName !== 'string') {
      throw new Error('Valid fee name is required');
    }
    if (typeof amount !== 'number' || amount < 0) {
      throw new Error('Valid positive amount is required');
    }
    return madrasaSettingsRepository.addFee(feeName, amount, userId);
  }

  async removeFee(feeName: string, userId: string) {
    if (!feeName || typeof feeName !== 'string') {
      throw new Error('Valid fee name is required');
    }
    return madrasaSettingsRepository.removeFee(feeName, userId);
  }
}

export const madrasaSettingsService = new MadrasaSettingsService();
