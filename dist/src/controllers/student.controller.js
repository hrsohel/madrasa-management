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
const Income_service_1 = require("../services/Income.service");
const Expense_service_1 = require("../services/Expense.service");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const studentService = new Student_service_1.StudentService();
const guardianService = new Guardian_service_1.GuardianService();
const addressService = new Address_service_1.AddressService();
const madrasaService = new Madrasa_service_1.MadrasaService();
const feesService = new Fees_service_1.FeesService();
const incomeService = new Income_service_1.IncomeService();
const expenseService = new Expense_service_1.ExpenseService();
class StudentController {
    toBanglaNumber(num) {
        const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
        return num
            .toString()
            .split("")
            .map((d) => (/\d/.test(d) ? banglaDigits[Number(d)] : d))
            .join("");
    }
    async addStudent(req, res, next) {
        const session = await mongoose_1.default.startSession();
        try {
            const userId = req.user.id;
            req.body.profileImage = req.file ? `/uploads/${req.file.filename}` : null;
            session.startTransaction();
            const student = await studentService.addStudent({ ...req.body.student, profileImage: req.body.profileImage, userId }, session);
            await guardianService.addGuardian({ ...req.body.guardian, student: student._id, userId }, session);
            await addressService.addAddress({ ...req.body.address, student: student._id, userId }, session);
            await madrasaService.addMadrasaInfo({ ...req.body.madrasa, student: student._id, userId }, session);
            await feesService.addFees({ ...req.body.fees, student: student._id, userId }, session);
            let totalFee = 0;
            const excludeFields = ["helpAmount", "helpType", "student", "userId", "_id"];
            for (const key in req.body.fees) {
                if (!excludeFields.includes(key) && !isNaN(Number(req.body.fees[key]))) {
                    totalFee += Number(req.body.fees[key]);
                }
            }
            const helpAmount = Number(req.body.fees.helpAmount || 0);
            const finalIncome = totalFee - helpAmount;
            if (finalIncome > 0) {
                await incomeService.addIncome({
                    amount: finalIncome,
                    sectorName: "Admission",
                    userId,
                    description: `Admission fee for student ${student.name} (Roll: ${student.roll || 'N/A'})`
                }, session);
            }
            if (helpAmount > 0) {
                await expenseService.addExpense({
                    amount: helpAmount,
                    sectorName: req.body.fees.helpType || "Scholarship",
                    userId,
                    description: `Fee waiver for student ${student.name} (Roll: ${student.roll || 'N/A'})`
                }, session);
            }
            await session.commitTransaction();
            return res.status(201).json({
                status: 201,
                success: true,
                messages: "student added",
                data: [],
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
            const userId = req.user.id;
            const data = await studentService.findStudentWithIdentifier({
                _id: req.params.id,
                userId
            });
            return res.status(201).json({
                status: 200,
                success: true,
                messages: "student data",
                data: data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateStudent(req, res, next) {
        try {
            const userId = req.user.id;
            if (req.file) {
                // Fetch existing student to get old image path
                const existingStudent = await studentService.findStudentWithIdentifier({
                    _id: req.params.id,
                    userId
                });
                if (existingStudent && Array.isArray(existingStudent) && existingStudent.length > 0 && existingStudent[0].profileImage) {
                    const oldImagePath = path_1.default.join(process.cwd(), existingStudent[0].profileImage);
                    // profileImage is stored as '/uploads/filename', so path.join with cwd might need adjustment if cwd is project root and uploads is at root. 
                    // Better to strip leading slash if present to avoid absolute path confusion, or just join carefully.
                    // Assumes storage is in {ProjectRoot}/uploads based on addStudent logic (req.file.filename).
                    try {
                        if (fs_1.default.existsSync(oldImagePath)) {
                            fs_1.default.unlinkSync(oldImagePath);
                        }
                    }
                    catch (err) {
                        console.error("Error deleting old image:", err);
                        // Proceed even if delete fails
                    }
                }
                req.body.profileImage = `/uploads/${req.file.filename}`;
            }
            // TODO: Verify ownership before update or ensure update filters by userId
            const updatedUser = await studentService.updateStudent({
                ...req.body,
                _id: req.params.id,
                userId // Assuming updateStudent logic will us this
            });
            return res.status(201).json({
                status: 201,
                success: true,
                messages: "student data updated",
                data: updatedUser,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async filterAllStudents(req, res, next) {
        try {
            const userId = req.user.id;
            const results = await studentService.filterStudent({ ...req.query, userId });
            return res.status(200).json({
                status: 200,
                message: "all student data",
                success: true,
                data: results,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.StudentController = StudentController;
