"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrePlannedFees = void 0;
// src/models/FeeHead.ts
const mongoose_1 = require("mongoose");
const feeHeadSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
exports.PrePlannedFees = (0, mongoose_1.model)('PrePlannedFees', feeHeadSchema);
