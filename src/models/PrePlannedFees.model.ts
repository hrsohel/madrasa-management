// src/models/FeeHead.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IFeeHead extends Document {
  name: string;
  nameEn: string;
  amount: number;
  isActive: boolean;
  userId: Types.ObjectId;
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PrePlannedFees = model<IFeeHead>('PrePlannedFees', feeHeadSchema);