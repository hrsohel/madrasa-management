"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Fees.model.ts
const mongoose_1 = require("mongoose");
const FeesSchema = new mongoose_1.Schema({
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Student',
        unique: true,
    },
    // Dynamic fee items - allows any fee type defined in Madrasa settings
    feeItems: {
        type: Map,
        of: Number,
        default: new Map(),
    },
    // Auto-calculated total of all fee items
    totalFees: {
        type: Number,
        default: 0,
        min: 0,
    },
    // Final amount after applying help/discount
    finalAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    helpType: {
        type: String,
        default: 'None',
    },
    helpAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    trxID: {
        type: String,
        required: false,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Pre-save hook to auto-calculate totalFees and finalAmount
FeesSchema.pre('save', function () {
    // Calculate total from feeItems Map
    if (this.feeItems && this.feeItems.size > 0) {
        this.totalFees = Array.from(this.feeItems.values()).reduce((sum, val) => sum + (val || 0), 0);
    }
    else {
        this.totalFees = 0;
    }
    // Calculate final amount after help/discount
    this.finalAmount = Math.max(0, this.totalFees - (this.helpAmount || 0));
});
// Indexes
FeesSchema.index({ helpType: 1 });
FeesSchema.index({ student: 1 });
const Fees = (0, mongoose_1.model)('Fees', FeesSchema);
exports.default = Fees;
