"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Madrasa = void 0;
const mongoose_1 = require("mongoose");
// Mongoose Schema
const MadrasaSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.Mixed,
        default: {}
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true, // automatically adds createdAt & updatedAt
});
// Indexes for better search performance
MadrasaSchema.index({ 'name.bangla': 'text', 'name.english': 'text' });
MadrasaSchema.index({ 'location.bangla': 'text', 'location.english': 'text' });
// Model
exports.Madrasa = (0, mongoose_1.model)('Madrasa', MadrasaSchema);
