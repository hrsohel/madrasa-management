// src/models/FeeHead.ts
import { Schema, model, Document } from 'mongoose';

export interface IFeeHead extends Document {
  name: string;
  nameEn: string;
  amount: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const feeHeadSchema = new Schema<IFeeHead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    nameEn: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PrePlannedFees = model<IFeeHead>('PrePlannedFees', feeHeadSchema);