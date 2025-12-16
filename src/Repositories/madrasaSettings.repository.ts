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

  async addFee(feeName: string, amount: number) {
    const existing = await this.get();
    if (!existing) {
      throw new Error('Madrasa settings not found. Please create settings first.');
    }

    const updatedFees = { ...existing.fees, [feeName]: amount };
    return Madrasa.findByIdAndUpdate(
      existing._id,
      { $set: { fees: updatedFees } },
      { new: true, runValidators: true }
    );
  }

  async removeFee(feeName: string) {
    const existing = await this.get();
    if (!existing) {
      throw new Error('Madrasa settings not found.');
    }

    const updatedFees = { ...existing.fees };
    delete updatedFees[feeName];

    return Madrasa.findByIdAndUpdate(
      existing._id,
      { $set: { fees: updatedFees } },
      { new: true, runValidators: true }
    );
  }
}

export const madrasaSettingsRepository = new MadrasaSettingsRepository();
