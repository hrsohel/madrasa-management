"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Fees.model.ts
const mongoose_1 = require("mongoose");
const FeesSchema = new mongoose_1.Schema({
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    trxID: {
        type: String,
        required: false,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User', // Assuming there's a 'User' model
        required: true,
    },
    helpAmount: {
        type: Number,
        // required: true,
        default: 0,
        min: 0
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Indexes
FeesSchema.index({ student: 1 }, { unique: true });
FeesSchema.index({ helpType: 1 });
const Fees = (0, mongoose_1.model)('Fees', FeesSchema);
exports.default = Fees;
