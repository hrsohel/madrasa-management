"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DIVISIONS = [
    'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna',
    'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'
];
const AddressSchema = new mongoose_1.Schema({
    // Present Address
    presentDivision: {
        type: String,
        // required: [true, 'Present division is required'],
    },
    presentDistrict: {
        type: String,
        // required: [true, 'Present district is required'],
        trim: true,
        minlength: [2, 'District name too short'],
    },
    presentUpazila: {
        type: String,
        // required: [true, 'Present upazila is required'],
        trim: true,
    },
    presentUnion: {
        type: String,
        // required: [true, 'Present union is required'],
        trim: true,
    },
    presentVillage: {
        type: String,
        // required: [true, 'Present village/ward is required'],
        trim: true,
    },
    presentOthers: {
        type: String,
        trim: true,
    },
    // Permanent Address
    permanentDivision: {
        type: String,
        // required: [true, 'Permanent division is required'],
    },
    permanentDistrict: {
        type: String,
        // required: [true, 'Permanent district is required'],
        trim: true,
    },
    permanentUpazila: {
        type: String,
        // required: [true, 'Permanent upazila is required'],
        trim: true,
    },
    permanentUnion: {
        type: String,
        // required: [true, 'Permanent union is required'],
        trim: true,
    },
    permanentVillage: {
        type: String,
        // required: [true, 'Permanent village/ward is required'],
        trim: true,
    },
    permanentOthers: {
        type: String,
        trim: true,
    },
    // Reference to Student
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        unique: true, // One address per student
    },
    // Optional: Mark if permanent = present
    isSameAsPresent: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Indexes
AddressSchema.index({ student: 1 });
AddressSchema.index({ presentDivision: 1, presentDistrict: 1 });
AddressSchema.index({ permanentDivision: 1, permanentDistrict: 1 });
// Pre-save: Auto-copy present → permanent if same
AddressSchema.pre('save', async function () {
    if (this.isSameAsPresent) {
        this.permanentDivision = this.presentDivision;
        this.permanentDistrict = this.presentDistrict;
        this.permanentUpazila = this.presentUpazila;
        this.permanentUnion = this.presentUnion;
        this.permanentVillage = this.presentVillage;
        this.permanentOthers = this.presentOthers;
    }
});
const Address = (0, mongoose_1.model)('Address', AddressSchema);
exports.default = Address;
