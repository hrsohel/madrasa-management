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
        let isTransactionStarted = false;
        try {
            const userId = req.user.id;
            console.log(`[addStudent] Start registration for userId: ${userId}`);
            // Helper to parse stringified JSON from multipart/form-data
            const parseField = (field) => {
                if (typeof field === 'string') {
                    try {
                        return JSON.parse(field);
                    }
                    catch (e) {
                        return field;
                    }
                }
                return field;
            };
            // Safely parse objects in case they are stringified by multipart-form request
            const studentPayload = parseField(req.body.student) || {};
            const guardianPayload = parseField(req.body.guardian) || {};
            const addressPayload = parseField(req.body.addresse || req.body.address) || {};
            const madrasaPayload = parseField(req.body.oldMadrasaInfo || req.body.madrasa) || {};
            const feesPayload = parseField(req.body.fees) || {};
            req.body.profileImage = req.file ? `/uploads/${req.file.filename}` : null;
            console.log(`[addStudent] Student UID from payload: ${studentPayload.uid}`);
            const existingStudent = await studentService.findByIdOrUid(studentPayload._id, studentPayload.uid, userId);
            console.log(`[addStudent] Existing student found: ${!!existingStudent}${existingStudent ? ` (Status: ${existingStudent.status}, ID: ${existingStudent._id})` : ''}`);
            // --- Transaction Setup ---
            const topologyType = mongoose_1.default.connection.getClient().topology?.description?.type;
            const supportsTransactions = topologyType === 'ReplicaSetWithPrimary' || topologyType === 'Sharded';
            if (supportsTransactions) {
                try {
                    session.startTransaction();
                    isTransactionStarted = true;
                    console.log("[addStudent] Transaction started successfully");
                }
                catch (transactionError) {
                    console.warn("[addStudent] Failed to start transaction:", transactionError);
                }
            }
            else {
                console.warn(`[addStudent] Transactions not supported on MongoDB topology: ${topologyType}. Proceeding without transaction.`);
            }
            const activeSession = isTransactionStarted ? session : undefined;
            // Sanitization Helper: removes internal MongoDB/Mongoose fields
            const sanitize = (obj) => {
                if (!obj || typeof obj !== 'object')
                    return obj;
                const clean = { ...obj };
                delete clean._id;
                delete clean.__v;
                delete clean.createdAt;
                delete clean.updatedAt;
                return clean;
            };
            // Draft-specific fields that should NOT be in the main Student document
            const draftFields = ['guardian', 'addresse', 'fees', 'oldMadrasaInfo'];
            const cleanStudentPayload = sanitize(studentPayload);
            draftFields.forEach(field => delete cleanStudentPayload[field]);
            let student;
            if (existingStudent) {
                if (existingStudent.status === 'draft') {
                    console.log(`[addStudent] Promoting draft student ${existingStudent._id} to active`);
                    // Promote draft to active and update data
                    // We use the existing database ID (_id) for the student record itself
                    student = await studentService.updateStudent({
                        ...cleanStudentPayload,
                        _id: existingStudent._id,
                        status: 'active',
                        profileImage: req.body.profileImage,
                        userId
                    }, activeSession);
                }
                else {
                    console.warn(`[addStudent] Conflict: Active student already exists with UID ${studentPayload.uid}`);
                    return res.status(409).json({
                        status: 409,
                        success: false,
                        message: "Student with this ID already exists",
                    });
                }
            }
            else {
                console.log("[addStudent] Creating new active student");
                student = await studentService.addStudent({ ...cleanStudentPayload, profileImage: req.body.profileImage, userId }, activeSession);
            }
            if (!student) {
                console.error("[addStudent] Critical: Student record could not be created or updated");
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Failed to process student record",
                });
            }
            console.log(`[addStudent] Student record active: ${student._id}. Saving associated details...`);
            // Save Guardian, Address, Madrasa, Fees (Stripped of old IDs to prevent duplicate key errors)
            await guardianService.addGuardian({ ...sanitize(guardianPayload), student: student._id, userId }, activeSession);
            await addressService.addAddress({ ...sanitize(addressPayload), student: student._id, userId }, activeSession);
            await madrasaService.addMadrasaInfo({ ...sanitize(madrasaPayload), student: student._id, userId }, activeSession);
            await feesService.addFees({ ...sanitize(feesPayload), student: student._id, userId }, activeSession);
            // Income/Expense logic
            let totalFee = 0;
            const excludeFields = ["helpAmount", "helpType", "student", "userId", "_id"];
            for (const key in feesPayload) {
                if (!excludeFields.includes(key) && !isNaN(Number(feesPayload[key]))) {
                    totalFee += Number(feesPayload[key]);
                }
            }
            const helpAmount = Number(feesPayload.helpAmount || 0);
            const finalIncome = totalFee - helpAmount;
            if (finalIncome > 0) {
                console.log(`[addStudent] Recording income: ${finalIncome}`);
                await incomeService.addIncome({
                    amount: finalIncome,
                    sectorName: "Admission",
                    userId,
                    description: `Admission fee for student ${student.name} (Roll: ${student.roll || 'N/A'})`
                }, activeSession);
            }
            if (helpAmount > 0) {
                console.log(`[addStudent] Recording expense (waiver): ${helpAmount}`);
                await expenseService.addExpense({
                    amount: helpAmount,
                    sectorName: feesPayload.helpType || "Scholarship",
                    userId,
                    description: `Fee waiver for student ${student.name} (Roll: ${student.roll || 'N/A'})`
                }, activeSession);
            }
            if (isTransactionStarted) {
                await session.commitTransaction();
                console.log("[addStudent] Transaction committed");
            }
            console.log("[addStudent] Registration complete. Fetching populated data...");
            const populatedStudent = await studentService.findStudentWithIdentifier({ _id: student._id, userId });
            return res.status(201).json({
                status: 201,
                success: true,
                messages: "student added",
                data: populatedStudent[0],
            });
        }
        catch (error) {
            if (isTransactionStarted) {
                await session.abortTransaction();
            }
            console.error("[addStudent] Error:", error);
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
        // Calling updateFullDetails internally as the logic is now unified
        return this.updateFullDetails(req, res, next);
    }
    async updateFullDetails(req, res, next) {
        const session = await mongoose_1.default.startSession();
        let isTransactionStarted = false;
        try {
            // --- Transaction Setup ---
            const topologyType = mongoose_1.default.connection.getClient().topology?.description?.type;
            const supportsTransactions = topologyType === 'ReplicaSetWithPrimary' || topologyType === 'Sharded';
            if (supportsTransactions) {
                try {
                    session.startTransaction();
                    isTransactionStarted = true;
                    console.log("[updateFullDetails] Transaction started successfully");
                }
                catch (transactionError) {
                    console.warn("[updateFullDetails] Failed to start transaction:", transactionError);
                }
            }
            else {
                console.warn(`[updateFullDetails] Transactions not supported on MongoDB topology: ${topologyType}. Proceeding without transaction.`);
            }
            const activeSession = isTransactionStarted ? session : undefined;
            console.log('Update Body:', req.body);
            // 1. Update Student
            // Handle student array if present (unlikely for student, but consistency)
            let studentBody = req.body.student;
            if (Array.isArray(studentBody))
                studentBody = studentBody[0];
            if (!studentBody)
                studentBody = {};
            const userId = req.user.id;
            const studentData = {
                ...req.body, // Start with root fields (legacy support)
                ...(studentBody || {}), // Override/Merge with structured 'student' object if present
                _id: req.params.id,
                userId
            };
            // Remove keys that are definitely NOT student data
            delete studentData.student;
            delete studentData.guardian;
            delete studentData.address;
            delete studentData.addresse;
            delete studentData.madrasa;
            delete studentData.oldMadrasaInfo;
            delete studentData.fees;
            // Handle profile image if uploaded
            if (req.file) {
                studentData.profileImage = `/uploads/${req.file.filename}`;
            }
            else if (req.body.profileImage) {
                studentData.profileImage = req.body.profileImage;
            }
            const updatedStudent = await studentService.updateStudent(studentData, activeSession);
            // 2. Fetch existing related docs to get their IDs
            const existingData = await studentService.findStudentWithIdentifier({ _id: req.params.id, userId });
            if (!existingData || existingData.length === 0) {
                throw new Error("Student not found or access denied");
            }
            const student = existingData[0];
            // Helper to handle Array or Object
            const getData = (data) => {
                if (Array.isArray(data))
                    return data[0];
                return data;
            };
            // 3. Update Guardian
            if (req.body.guardian) {
                const guardianId = student.guardian?.[0]?._id;
                const guardianBody = getData(req.body.guardian);
                if (guardianId && guardianBody) {
                    await guardianService.updateGuardian({ ...guardianBody, _id: guardianId }, activeSession);
                }
                else if (!guardianId && guardianBody) {
                    // If guardian doesn't exist but data provided, create it?
                    // For now adhering to update logic.
                }
            }
            // 4. Update Address (support both 'address' and 'addresse')
            const addressPayload = req.body.address || req.body.addresse;
            if (addressPayload) {
                const addressId = student.addresse?.[0]?._id;
                const addressBody = getData(addressPayload);
                if (addressId && addressBody) {
                    await addressService.updateAddress({ ...addressBody, _id: addressId }, activeSession);
                }
            }
            // 5. Update Previous Madrasa Info (support both 'madrasa' and 'oldMadrasaInfo')
            const madrasaPayload = req.body.madrasa || req.body.oldMadrasaInfo;
            if (madrasaPayload) {
                const madrasaId = student.oldMadrasaInfo?.[0]?._id;
                const madrasaBody = getData(madrasaPayload);
                if (madrasaId && madrasaBody) {
                    await madrasaService.updateMadrasaInfo({ ...madrasaBody, _id: madrasaId }, activeSession);
                }
            }
            // 6. Update Fees (if included)
            if (req.body.fees) {
                const feesId = student.fees?.[0]?._id;
                const feesBody = getData(req.body.fees);
                if (feesId && feesBody) {
                    await feesService.updateFees({ ...feesBody, _id: feesId });
                }
            }
            if (isTransactionStarted) {
                await session.commitTransaction();
                console.log("[updateFullDetails] Transaction committed");
            }
            // Return updated data
            const finalData = await studentService.findStudentWithIdentifier({ _id: req.params.id });
            return res.status(200).json({
                status: 200, // Changed from 201 to 200 for update
                success: true,
                messages: "student data updated", // simplified message to match user expectation
                data: finalData[0],
            });
        }
        catch (error) {
            if (isTransactionStarted) {
                await session.abortTransaction();
            }
            console.error("[updateFullDetails] Error:", error);
            next(error);
        }
        finally {
            session.endSession();
        }
    }
    async filterAllStudents(req, res, next) {
        try {
            const userId = req.user.id;
            // Default to status: 'active' if not specified
            const filter = {
                status: 'active',
                ...req.query,
                userId
            };
            const results = await studentService.filterStudent(filter);
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
    async saveDraft(req, res, next) {
        const session = await mongoose_1.default.startSession();
        let isTransactionStarted = false;
        try {
            const userId = req.user.id;
            const topologyType = mongoose_1.default.connection.getClient().topology?.description?.type;
            const supportsTransactions = topologyType === 'ReplicaSetWithPrimary' || topologyType === 'Sharded';
            if (supportsTransactions) {
                try {
                    session.startTransaction();
                    isTransactionStarted = true;
                }
                catch (transactionError) {
                    console.warn("Failed to start transaction in saveDraft:", transactionError);
                }
            }
            else {
                console.warn(`Transactions not supported on MongoDB topology: ${topologyType}. Proceeding without transaction.`);
            }
            const activeSession = isTransactionStarted ? session : undefined;
            req.body.profileImage = req.file ? `/uploads/${req.file.filename}` : null;
            // Handle legacy payload (root fields) vs nested 'student' field
            let studentBody = req.body.student || {};
            // If student is array, take first (safeguard)
            if (Array.isArray(studentBody))
                studentBody = studentBody[0];
            // Construct the unified draft payload
            const draftData = {
                ...req.body, // Spread root properties (legacy/mix)
                ...studentBody, // Spread structured student props (overrides root)
                // Explicitly map/ensure the nested arrays are taken from body
                // and assigned to the schema fields we just added.
                guardian: req.body.guardian,
                addresse: req.body.addresse || req.body.address, // Handle both
                fees: req.body.fees,
                oldMadrasaInfo: req.body.oldMadrasaInfo || req.body.madrasa, // Handle both
                status: 'draft',
                profileImage: req.body.profileImage,
                userId // Add userId to draft data
            };
            // Cleanup: Remove the 'student' key if it exists in root to avoid duplication/bloat
            delete draftData.student;
            delete draftData.address;
            delete draftData.madrasa;
            let student;
            // Check for existing draft by either provided _id or uid
            const existingDraft = await studentService.findByIdOrUid(draftData._id, draftData.uid, userId);
            if (existingDraft) {
                if (existingDraft.status === 'draft') {
                    // Robust update: use the found draft's ID to ensure we update the right document
                    student = await studentService.updateStudent({ ...draftData, _id: existingDraft._id }, activeSession);
                }
                else {
                    return res.status(409).json({
                        status: 409,
                        success: false,
                        message: "Cannot save draft: An active student already exists with this ID",
                    });
                }
            }
            else {
                student = await studentService.addStudent(draftData, activeSession);
            }
            if (isTransactionStarted) {
                await session.commitTransaction();
            }
            return res.status(201).json({
                status: 201, // Created
                success: true,
                messages: "Draft saved successfully",
                data: student,
            });
        }
        catch (error) {
            if (isTransactionStarted) {
                await session.abortTransaction();
            }
            next(error);
        }
        finally {
            session.endSession();
        }
    }
    async getDrafts(req, res, next) {
        try {
            const userId = req.user.id;
            // Use aggregation to get populated details filtered by userId
            const results = await studentService.findDrafts(userId);
            return res.status(200).json({
                status: 200,
                message: "draft students",
                success: true,
                data: results,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getDraftById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            // Fetch specifically by ID. 
            // Since drafts have embedded fields, verify we get those.
            // BaseService has findById or findStudentWithIdentifier.
            // findStudentWithIdentifier uses aggregate and populates 'guardian' etc. from SEPARATE collections.
            // BUT for drafts, data is EMBEDDED. 
            // Use findById (lean) which should return the raw document with embedded fields.
            const student = await studentService.findStudentId(id);
            if (!student) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: "Draft not found"
                });
            }
            // Verify userId matches (user-based data isolation)
            // Verify userId matches (user-based data isolation)
            if (student.userId !== userId) {
                return res.status(403).json({
                    status: 403,
                    success: false,
                    message: "Access denied"
                });
            }
            return res.status(200).json({
                status: 200,
                message: "draft student details",
                success: true,
                data: student,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteDraft(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            // First verify the draft belongs to the user
            const student = await studentService.findStudentId(id);
            if (!student) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: "Draft not found",
                });
            }
            // Verify userId matches
            if (student.userId !== userId) {
                return res.status(403).json({
                    status: 403,
                    success: false,
                    message: "Access denied",
                });
            }
            const result = await studentService.deleteStudent(id);
            if (!result) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: "Draft not found or already deleted",
                });
            }
            return res.status(200).json({
                status: 200,
                success: true,
                message: "Draft deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateDraft(req, res, next) {
        const session = await mongoose_1.default.startSession();
        let isTransactionStarted = false;
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const topologyType = mongoose_1.default.connection.getClient().topology?.description?.type;
            const supportsTransactions = topologyType === 'ReplicaSetWithPrimary' || topologyType === 'Sharded';
            if (supportsTransactions) {
                try {
                    session.startTransaction();
                    isTransactionStarted = true;
                }
                catch (transactionError) {
                    console.warn("Failed to start transaction in updateDraft:", transactionError);
                }
            }
            else {
                console.warn(`Transactions not supported on MongoDB topology: ${topologyType}. Proceeding without transaction.`);
            }
            const activeSession = isTransactionStarted ? session : undefined;
            // Find the existing draft to ensure it belongs to the user
            const existingDraft = await studentService.findStudentId(id);
            if (!existingDraft || existingDraft.userId !== userId) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: "Draft not found or access denied",
                });
            }
            const draftData = { ...req.body };
            // Handle profile image if uploaded
            if (req.file) {
                draftData.profileImage = `/uploads/${req.file.filename}`;
                // If there was an old image, delete it
                if (existingDraft.profileImage) {
                    const oldImagePath = path_1.default.join(__dirname, '..', '..', existingDraft.profileImage);
                    if (fs_1.default.existsSync(oldImagePath)) {
                        fs_1.default.unlinkSync(oldImagePath);
                    }
                }
            }
            const student = await studentService.updateStudent({ ...draftData, _id: id }, activeSession);
            if (isTransactionStarted) {
                await session.commitTransaction();
            }
            return res.status(200).json({
                status: 200,
                success: true,
                messages: "Draft updated successfully",
                data: student,
            });
        }
        catch (error) {
            if (isTransactionStarted) {
                await session.abortTransaction();
            }
            next(error);
        }
        finally {
            session.endSession();
        }
    }
}
exports.StudentController = StudentController;
