"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const Madrasa_model_1 = require("../models/Madrasa.model");
const Student_model_1 = __importDefault(require("../models/Student.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const user_constants_1 = require("../constants/user.constants");
const sendEmail_1 = require("../utils/sendEmail");
const bcrypt_1 = __importDefault(require("bcrypt"));
const getAdminPanelData = async () => {
    const madrasa = await Madrasa_model_1.Madrasa.findOne();
    const totalStudents = await Student_model_1.default.countDocuments();
    if (!madrasa) {
        throw new Error("Madrasa not found");
    }
    return {
        institutionName: madrasa.name,
        totalStudents,
        accountOpeningDate: madrasa.createdAt,
    };
};
const createNewInstitution = async (email, password, institutionName, totalStudents) => {
    // 1. Create a new admin user
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const newUser = new User_model_1.default({
        fullName: institutionName, // Or a default admin name
        email,
        password: hashedPassword,
        totalStudents,
        role: user_constants_1.UserRole.ADMIN,
    });
    await newUser.save();
    // 2. Create a new madrasa
    // const newMadrasa = new Madrasa({
    //   name: {
    //       bangla: institutionName,
    //       english: institutionName,
    //   },
    //   contact: {
    //       email: email,
    //       phone: "" // Assuming phone will be updated later
    //   },
    //   location: {
    //       bangla: "Default Location",
    //       english: "Default Location"
    //   }
    // });
    // await newMadrasa.save();
    // 3. Send an email with credentials
    const emailSubject = "Your New Institution Account Credentials";
    const emailText = `Hello ${institutionName},\n\nYour new institution account has been created.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease login and change your password.\n\nThank you!`;
    await (0, sendEmail_1.sendEmail)(email, emailSubject, emailText);
    return {
        user: newUser,
    };
};
exports.AdminService = {
    getAdminPanelData,
    createNewInstitution,
};
