import { Madrasa, IMadrasa } from '../models/Madrasa.model';

class MadrasaSettingsRepository {
  async get(userId: string) {
    return Madrasa.findOne({ userId });
  }

  async create(data: Partial<IMadrasa>, userId: string) {
    const existing = await this.get(userId);
    if (existing) {
      throw new Error('A Madrasa entry already exists for this user.');
    }
    return Madrasa.create({ ...data, userId });
  }

  async update(data: Partial<IMadrasa>, userId: string) {
    return Madrasa.findOneAndUpdate({ userId }, data, { new: true, runValidators: true });
  }

  async addFee(feeName: string, amount: number, userId: string) {
    const existing = await this.get(userId);
    if (!existing) {
      throw new Error('Madrasa settings not found. Please create settings first.');
    }

    const updatedFees = { ...existing.fees, [feeName]: amount };
    return Madrasa.findOneAndUpdate(
      { userId },
      { $set: { fees: updatedFees } },
      { new: true, runValidators: true }
    );
  }

  async removeFee(feeName: string, userId: string) {
    const existing = await this.get(userId);
    if (!existing) {
      throw new Error('Madrasa settings not found.');
    }

    const updatedFees = { ...existing.fees };
    delete updatedFees[feeName];

    return Madrasa.findOneAndUpdate(
      { userId },
      { $set: { fees: updatedFees } },
      { new: true, runValidators: true }
    );
  }
}

export const madrasaSettingsRepository = new MadrasaSettingsRepository();
