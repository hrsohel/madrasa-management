import { Madrasa, IMadrasa } from '../models/Madrasa.model';

class MadrasaSettingsRepository {
  async get() {
    return Madrasa.findOne();
  }

  async create(data: Partial<IMadrasa>) {
    const existing = await this.get();
    if (existing) {
      throw new Error('A Madrasa entry already exists.');
    }
    return Madrasa.create(data);
  }

  async update(data: Partial<IMadrasa>) {
    return Madrasa.findOneAndUpdate({}, data, { new: true, runValidators: true });
  }
}

export const madrasaSettingsRepository = new MadrasaSettingsRepository();
