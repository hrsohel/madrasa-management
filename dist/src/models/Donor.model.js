"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DonorSchema = new mongoose_1.Schema({
    donorName: {
        type: String,
        default: null
    },
    amountPerStep: {
        type: Number,
        default: 0,
        min: [0, "amount must be less than 0"]
    },
    phone: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});
const Donor = (0, mongoose_1.model)("Donor", DonorSchema);
exports.default = Donor;
