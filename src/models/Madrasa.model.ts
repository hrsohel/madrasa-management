import { Schema, model, Document, Types } from 'mongoose';

// Interface for the document
export interface IMadrasa extends Document {
  logo?: string; // URL or path to logo (1200x1200 png/jpg)

  // Madrasa Name (Multilingual)
  name: {
    bangla: string;
    english: string;
    arabic?: string;
  };

  // Location / Address (Multilingual)
  location: {
    bangla: string;
    english: string;
    arabic?: string;
  };

  // Contact Information
  contact: {
    email: string;
    phone: string; // Stored as string to preserve leading zeros & country codes
  };

  fees: {
    [key: string]: number;
  };

  // Timestamps
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  userId: Types.ObjectId;
}

// Mongoose Schema
const MadrasaSchema = new Schema<IMadrasa>(
  {
    logo: {
      type: String,
      default: null
      //   validate: {
      //     validator: function (v: string) {
      //       if (!v) return true; // optional
      //       return /\.(png|jpe?g)$/i.test(v) && v.includes('1200x1200');
      //     },
      //     message: 'Logo must be 1200x1200 and in PNG/JPG format',
      //   },
    },

    name: {
      bangla: { type: String, required: true, trim: true },
      english: { type: String, required: true, trim: true },
      arabic: { type: String, trim: true },
    },

    location: {
      bangla: { type: String, required: true, trim: true },
      english: { type: String, required: true, trim: true },
      arabic: { type: String, trim: true },
    },

    contact: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        // match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      },
      phone: {
        type: String,
        required: true,
        trim: true,
        // match: [/^\+?[0-9]{10,15}$/, 'Please provide a valid phone number'],
      },
    },

    fees: {
      type: Schema.Types.Mixed,
      default: {}
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

// Indexes for better search performance
MadrasaSchema.index({ 'name.bangla': 'text', 'name.english': 'text' });
MadrasaSchema.index({ 'location.bangla': 'text', 'location.english': 'text' });

// Model
export const Madrasa = model<IMadrasa>('Madrasa', MadrasaSchema);