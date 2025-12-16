import { IMadrasa } from '../models/Madrasa.model';
import { madrasaSettingsRepository } from '../Repositories/madrasaSettings.repository';
import fs from 'fs';
import path from 'path';

class MadrasaSettingsService {
  async get() {
    return madrasaSettingsRepository.get();
  }

  async create(data: Partial<IMadrasa>, logoPath?: string) {
    if (logoPath) {
      data.logo = logoPath;
    }
    return madrasaSettingsRepository.create(data);
  }

  async update(data: Partial<IMadrasa>, logoPath?: string) {
    const existingMadrasa = await madrasaSettingsRepository.get();

    if (logoPath && existingMadrasa && existingMadrasa.logo) {
      const oldLogoPath = path.join(__dirname, '../../', existingMadrasa.logo);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    if (logoPath) {
      data.logo = logoPath;
    }

    return madrasaSettingsRepository.update(data);
  }

  async addFee(feeName: string, amount: number) {
    if (!feeName || typeof feeName !== 'string') {
      throw new Error('Valid fee name is required');
    }
    if (typeof amount !== 'number' || amount < 0) {
      throw new Error('Valid positive amount is required');
    }
    return madrasaSettingsRepository.addFee(feeName, amount);
  }

  async removeFee(feeName: string) {
    if (!feeName || typeof feeName !== 'string') {
      throw new Error('Valid fee name is required');
    }
    return madrasaSettingsRepository.removeFee(feeName);
  }
}

export const madrasaSettingsService = new MadrasaSettingsService();
