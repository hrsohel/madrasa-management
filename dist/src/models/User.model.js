"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_constants_1 = require("../constants/user.constants");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: Object.values(user_constants_1.UserRole),
        default: user_constants_1.UserRole.USER,
    },
    totalStudents: {
        type: String,
        default: "0"
    }
}, {
    timestamps: true,
});
userSchema.pre("save", (async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt_1.default.hash(this.password, 10);
    }
}));
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
