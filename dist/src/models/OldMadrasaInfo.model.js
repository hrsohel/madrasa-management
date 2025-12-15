"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/OldMadrasaInfo.model.ts
const mongoose_1 = require("mongoose");
const OldMadrasaInfoSchema = new mongoose_1.Schema({
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Student',
        // required: [true, 'Student reference is required'],
        unique: true, // One record per student
    },
    oldMadrasaName: {
        type: String,
        // required: [true, 'Previous madrasa/school name is required'],
        trim: true,
        minlength: [3, 'Madrasa name too short'],
        maxlength: [100, 'Madrasa name too long'],
    },
    oldMadrasaClass: {
        type: String,
        // required: [true, 'Previous class is required']
    },
    oldMadrasaResult: {
        type: String,
        // required: [true, 'Previous result is required']
    },
    talimiGuardianName: {
        type: String,
        // required: [true, 'Talimi guardian name is required'],
        trim: true,
        minlength: [3, 'Name too short'],
    },
    talimiGuardianPhone: {
        type: String,
        // required: [true, 'Talimi guardian phone is required']
    },
    admissionExaminer: {
        type: String,
        // required: [true, 'Examiner name is required'],
        trim: true,
    },
    admissionResult: {
        type: String,
        // required: [true, 'Admission result is required']
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes too long'],
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Indexes for performance
OldMadrasaInfoSchema.index({ student: 1 });
OldMadrasaInfoSchema.index({ admissionResult: 1 });
OldMadrasaInfoSchema.index({ oldMadrasaResult: 1 });
// Virtual: Friendly result text
OldMadrasaInfoSchema.virtual('admissionStatus').get(function () {
    switch (this.admissionResult) {
        case 'Selected': return 'Admission Confirmed';
        case 'Waiting': return 'Waiting for Final Decision';
        case 'Rejected': return 'Not Selected';
        default: return this.admissionResult;
    }
});
const OldMadrasaInfo = (0, mongoose_1.model)('OldMadrasaInfo', OldMadrasaInfoSchema);
exports.default = OldMadrasaInfo;
