"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GENDER = ['Male', 'Female'];
const BLOOD_GROUP = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const SHIFT = ['Morning', 'Day', 'Evening'];
const SECTION = ['A', 'B', 'C', 'D', 'Hifz', 'Nazira'];
const DIVISION = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'];
const StudentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        // required: [true, 'Student name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    dob: {
        type: Date,
        // required: [true, 'Date of birth is required'],
        // validate: {
        //   validator: (date: Date) => date < new Date(),
        //   message: 'Date of birth cannot be in the future',
        // },
    },
    nid: {
        type: String,
        // unique: true,
        // validate: {
        //   validator: (v: string) => /^\d{10,17}$/.test(v),
        //   message: 'Invalid NID/Birth Certificate number (10–17 digits)',
        // },
    },
    birthCertificate: {
        type: String,
        // unique: true,
        // match: [/^\d{17}$/, 'Birth certificate must be exactly 17 digits'],
    },
    gender: {
        type: String,
        // required: [true, 'Gender is required'],
        enum: {
            values: GENDER,
            message: 'Gender must be Male or Female',
        },
    },
    bloodGroup: {
        type: String,
        // required: [true, 'Blood group is required'],
        enum: {
            values: BLOOD_GROUP,
            message: 'Invalid blood group',
        },
    },
    phone: {
        type: String,
        // required: [true, 'Guardian phone is required'],
        // validate: {
        //   validator: (v: string) => /^(\+8801|01)[3-9]\d{8}$/.test(v),
        //   message: 'Invalid Bangladeshi mobile number (e.g., 017XXXXXXXX)',
        // },
    },
    uid: {
        type: String,
        unique: true,
        uppercase: true,
    },
    residential: {
        type: String,
    },
    roll: {
        type: String,
        unique: true,
    },
    class: {
        type: String,
    },
    shift: {
        type: String,
    },
    section: {
        type: String,
    },
    division: {
        type: String,
    },
    session: {
        type: String,
    },
    profileImage: {
        type: String,
        default: null
    },
    userId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'draft', 'archived'],
        default: 'active'
    },
    // Embedded fields for drafts
    guardian: { type: [mongoose_1.Schema.Types.Mixed], default: [] },
    addresse: { type: [mongoose_1.Schema.Types.Mixed], default: [] },
    fees: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    oldMadrasaInfo: { type: [mongoose_1.Schema.Types.Mixed], default: [] }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: false // Allow saving fields not defined in schema (for drafts)
});
StudentSchema.index({ class: 1, section: 1, session: 1 });
// Removed duplicate uid and roll indices as they are marked unique: true
StudentSchema.virtual('age').get(function () {
    if (!this.dob)
        return null;
    const today = new Date();
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});
const Student = (0, mongoose_1.model)('Student', StudentSchema);
exports.default = Student;
