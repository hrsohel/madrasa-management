"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const Student_service_1 = require("../services/Student.service");
const Guardian_service_1 = require("../services/Guardian.service");
const Address_service_1 = require("../services/Address.service");
const Madrasa_service_1 = require("../services/Madrasa.service");
const Fees_service_1 = require("../services/Fees.service");
const mongoose_1 = __importDefault(require("mongoose"));
const studentService = new Student_service_1.StudentService();
const guardianService = new Guardian_service_1.GuardianService();
const addressService = new Address_service_1.AddressService();
const madrasaService = new Madrasa_service_1.MadrasaService();
const feesService = new Fees_service_1.FeesService();
class StudentController {
    async addStudent(req, res, next) {
        const session = await mongoose_1.default.startSession();
        try {
            req.body.profileImage = req.file ? `/uploads/${req.file.filename}` : null;
            session.startTransaction();
            const student = await studentService.addStudent({ ...req.body.student, profileImage: req.body.profileImage }, session);
            await guardianService.addGuardian({ ...req.body.guardian, student: student._id }, session);
            await addressService.addAddress({ ...req.body.address, student: student._id }, session);
            await madrasaService.addMadrasaInfo({ ...req.body.madrasa, student: student._id }, session);
            await feesService.addFees({ ...req.body.fees, student: student._id }, session);
            await session.commitTransaction();
            return res.status(201).json({
                status: 201,
                success: true,
                messages: "student added",
                data: []
            });
        }
        catch (error) {
            await session.abortTransaction();
            next(error);
        }
        finally {
            session.endSession();
        }
    }
    async getStudentWithPopulated(req, res, next) {
        try {
            const data = await studentService.findStudentWithIdentifier({ _id: req.params.id });
            return res.status(201).json({
                status: 200,
                success: true,
                messages: "student data",
                data: data
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateStudent(req, res, next) {
        try {
            const updatedUser = await studentService.updateStudent({ ...req.body, _id: req.params.id });
            return res.status(201).json({
                status: 201,
                success: true,
                messages: "student data updated",
                data: updatedUser
            });
        }
        catch (error) {
            next(error);
        }
    }
    async filterAllStudents(req, res, next) {
        try {
            const results = await studentService.filterStudent(req.query);
            return res.status(200).json({
                status: 200,
                message: "all student data",
                success: true,
                data: results
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.StudentController = StudentController;
