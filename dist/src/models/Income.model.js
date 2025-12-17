"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const IncomeSchema = new mongoose_1.Schema({
    roshidNo: {
        type: String,
        default: () => `R-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        unique: true
    },
    donorName: {
        type: String,
        default: null,
    },
    amount: {
        type: Number,
        default: 0,
        min: [0, "amount must not be less than 0"]
    },
    sectorName: {
        type: String,
        default: null
    },
    method: {
        type: String,
        default: null
    },
    receiptIssuer: {
        type: String,
        default: null
    },
    additionalNotes: {
        type: String,
        default: null
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
const Income = (0, mongoose_1.model)("Income", IncomeSchema);
exports.default = Income;
