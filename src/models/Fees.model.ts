// src/models/Fees.model.ts
import { Schema, model, Document } from 'mongoose';

export interface IFees extends Document {
  student: Schema.Types.ObjectId; // ref: 'Student'

  admissionFee: number;
  libraryFee: number;
  confirmFee: number;
  ITFee: number;
  IDCardFee: number;
  kafelaFee: number;
  booksFee: number;

  helpType: string;     // e.g., "Orphan", "Scholarship", "Staff Child", "Poor Fund"
  helpAmount: number;   // Amount waived or discounted (as string if you want to store "Full" / "50%" etc.)
}

const FeesSchema = new Schema<IFees>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      // required: true,
      unique: true,
    },

    admissionFee: {
      type: Number,
      // required: true,
      min: 0,
    },

    libraryFee: {
      type: Number,
      // required: true,
      min: 0,
    },

    confirmFee: {
      type: Number,
      // required: true,
      min: 0,
    },

    ITFee: {
      type: Number,
      // required: true,
      min: 0,
    },

    IDCardFee: {
      type: Number,
      // required: true,
      min: 0,
    },

    kafelaFee: {
      type: Number,
      // required: true,
      min: 0,
    },

    booksFee: {
      type: Number,
      // required: true,
      min: 0,
    },

    helpType: {
      type: String,
      // required: true,
      default: 'None',
    },
    helpAmount: {
      type: Number,
      // required: true,
      default: 0,
      min: 0
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
FeesSchema.index({ student: 1 }, { unique: true });
FeesSchema.index({ helpType: 1 });

const Fees = model<IFees>('Fees', FeesSchema);

export default Fees;