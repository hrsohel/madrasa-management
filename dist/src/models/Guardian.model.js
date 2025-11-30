"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Guardian.model.ts
const mongoose_1 = require("mongoose");
const GuardianSchema = new mongoose_1.Schema({
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        unique: true,
    },
    // Father
    fatherName: {
        type: String,
        required: [true, "Father's name is required"],
        trim: true,
        minlength: [3, "Father's name too short"],
        maxlength: [50, "Father's name too long"],
    },
    fatherNID: {
        type: String,
        required: [true, "Father's NID is required"],
        unique: true,
        validate: {
            validator: (v) => /^\d{10}$|^\d{13}$|^\d{17}$/.test(v),
            message: 'Father NID must be 10, 13, or 17 digits',
        },
    },
    fatherPhone: {
        type: String,
        validate: {
            validator: function (v) {
                // Optional if guardian is father
                if (this.guardianRelation === 'Father' && !v)
                    return false;
                if (!v)
                    return true; // optional otherwise
                return /^01[3-9]\d{8}$/.test(v);
            },
            message: 'Invalid or missing father phone number',
        },
    },
    // Mother
    motherName: {
        type: String,
        required: [true, "Mother's name is required"],
        trim: true,
        minlength: [3, "Mother's name too short"],
    },
    motherNID: {
        type: String,
        required: [true, "Mother's NID is required"],
        unique: true,
        validate: {
            validator: (v) => /^\d{10}$|^\d{13}$|^\d{17}$/.test(v),
            message: 'Mother NID must be 10, 13, or 17 digits',
        },
    },
    motherPhone: {
        type: String,
        validate: {
            validator: function (v) {
                if (this.guardianRelation === 'Mother' && !v)
                    return false;
                if (!v)
                    return true;
                return /^01[3-9]\d{8}$/.test(v);
            },
            message: 'Invalid or missing mother phone number',
        },
    },
    // Main Guardian (the one we contact)
    guardianName: {
        type: String,
        required: [true, 'Guardian name is required'],
        trim: true,
    },
    guardianNID: {
        type: String,
        required: [true, 'Guardian NID is required'],
        validate: {
            validator: (v) => /^\d{10}$|^\d{13}$|^\d{17}$/.test(v),
            message: 'Guardian NID must be 10, 13, or 17 digits',
        },
    },
    guardianPhone: {
        type: String,
        required: [true, 'Guardian phone is required'],
        validate: {
            validator: (v) => /^01[3-9]\d{8}$/.test(v),
            message: 'Invalid Bangladeshi mobile number (e.g., 017xxxxxxxx)',
        },
    },
    guardianRelation: {
        type: String,
        required: [true, 'Guardian relation is required'],
        enum: {
            values: ['Father', 'Mother', 'Uncle', 'Aunt', 'Grandfather', 'Grandmother', 'Other'],
            message: 'Invalid guardian relation',
        },
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Indexes for performance
GuardianSchema.index({ fatherNID: 1 });
GuardianSchema.index({ motherNID: 1 });
GuardianSchema.index({ guardianPhone: 1 });
// Virtual: Check if guardian is one of the parents
GuardianSchema.virtual('isParentGuardian').get(function () {
    return this.guardianRelation === 'Father' || this.guardianRelation === 'Mother';
});
// Pre-save: Auto-fill guardian info if father/mother is selected
GuardianSchema.pre('save', function () {
    if (this.guardianRelation === 'Father') {
        this.guardianName = this.fatherName;
        this.guardianNID = this.fatherNID;
        this.guardianPhone = this.fatherPhone || this.guardianPhone;
    }
    else if (this.guardianRelation === 'Mother') {
        this.guardianName = this.motherName;
        this.guardianNID = this.motherNID;
        this.guardianPhone = this.motherPhone || this.guardianPhone;
    }
});
const Guardian = (0, mongoose_1.model)('Guardian', GuardianSchema);
exports.default = Guardian;
