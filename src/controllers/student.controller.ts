import { NextFunction, Request, Response } from "express";
import { StudentService } from "../services/Student.service";
import { GuardianService } from "../services/Guardian.service";
import { AddressService } from "../services/Address.service";
import { MadrasaService } from "../services/Madrasa.service";
import { FeesService } from "../services/Fees.service";
import mongoose from "mongoose";
import { IncomeService } from "../services/Income.service";
import { ExpenseService } from "../services/Expense.service";
import fs from "fs";
import path from "path";

const studentService = new StudentService();
const guardianService = new GuardianService();
const addressService = new AddressService();
const madrasaService = new MadrasaService();
const feesService = new FeesService();
const incomeService = new IncomeService();
const expenseService = new ExpenseService()

export class StudentController {
  toBanglaNumber(num: number): string {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((d) => (/\d/.test(d) ? banglaDigits[Number(d)] : d))
      .join("");
  }
  async addStudent(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    let isTransactionStarted = false;
    try {
      const userId = (req.user as any).id;
      console.log(`[addStudent] Start registration for userId: ${userId}`);

      // Helper to parse stringified JSON from multipart/form-data
      const parseField = (field: any) => {
        if (typeof field === 'string') {
          try { return JSON.parse(field); }
          catch (e) { return field; }
        }
        return field;
      };

      // Safely parse objects in case they are stringified by multipart-form request
      const studentPayload = parseField(req.body.student) || {};
      const guardianPayload = parseField(req.body.guardian) || {};
      const addressPayload = parseField(req.body.addresse || req.body.address) || {};
      const madrasaPayload = parseField(req.body.oldMadrasaInfo || req.body.madrasa) || {};
      const feesPayload = parseField(req.body.fees) || {};

      req.body.profileImage = (req as any).file ? `/uploads/${(req as any).file.filename}` : null
      console.log(`[addStudent] Student UID from payload: ${studentPayload.uid}`);

      const existingStudent = await studentService.findByIdOrUid(studentPayload._id, studentPayload.uid, userId);
      console.log(`[addStudent] Existing student found: ${!!existingStudent}${existingStudent ? ` (Status: ${existingStudent.status}, ID: ${existingStudent._id})` : ''}`);

      // --- Transaction Setup ---
      const topologyType = (mongoose.connection.getClient() as any).topology?.description?.type;
      const supportsTransactions = topologyType === 'ReplicaSetWithPrimary' || topologyType === 'Sharded';

      if (supportsTransactions) {
        try {
          session.startTransaction();
          isTransactionStarted = true;
          console.log("[addStudent] Transaction started successfully");
        } catch (transactionError) {
          console.warn("[addStudent] Failed to start transaction:", transactionError);
        }
      } else {
        console.warn(`[addStudent] Transactions not supported on MongoDB topology: ${topologyType}. Proceeding without transaction.`);
      }

      const activeSession = isTransactionStarted ? session : undefined;

      // Sanitization Helper: removes internal MongoDB/Mongoose fields
      const sanitize = (obj: any) => {
        if (!obj || typeof obj !== 'object') return obj;
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
        } else {
          console.warn(`[addStudent] Conflict: Active student already exists with UID ${studentPayload.uid}`);
          return res.status(409).json({
            status: 409,
            success: false,
            message: "Student with this ID already exists",
          });
        }
      } else {
        console.log("[addStudent] Creating new active student");
        student = await studentService.addStudent({ ...cleanStudentPayload, profileImage: req.body.profileImage, userId }, activeSession)
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
      await guardianService.addGuardian({ ...sanitize(guardianPayload), student: student._id, userId }, activeSession)
      await addressService.addAddress({ ...sanitize(addressPayload), student: student._id, userId }, activeSession)
      await madrasaService.addMadrasaInfo({ ...sanitize(madrasaPayload), student: student._id, userId }, activeSession)
      await feesService.addFees({ ...sanitize(feesPayload), student: student._id, userId }, activeSession)

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
    } catch (error: unknown) {
      if (isTransactionStarted) {
        await session.abortTransaction();
      }
      console.error("[addStudent] Error:", error);
      next(error as Error);
    } finally {
      session.endSession();
    }
  }
  async getStudentWithPopulated(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as any).id;
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
    } catch (error: unknown) {
      next(error as Error);
    }
  }

  async updateStudent(req: Request, res: Response, next: NextFunction) {
    // Calling updateFullDetails internally as the logic is now unified
    return this.updateFullDetails(req, res, next);
  }

  async updateFullDetails(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      console.log('Update Body:', req.body);

      // 1. Update Student
      // Handle student array if present (unlikely for student, but consistency)
      let studentBody = req.body.student;
      if (Array.isArray(studentBody)) studentBody = studentBody[0];
      if (!studentBody) studentBody = {};

      const userId = (req.user as any).id;
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
      if ((req as any).file) {
        studentData.profileImage = `/uploads/${(req as any).file.filename}`;
      } else if (req.body.profileImage) {
        studentData.profileImage = req.body.profileImage;
      }

      const updatedStudent = await studentService.updateStudent(studentData, session);

      // 2. Fetch existing related docs to get their IDs
      const existingData: any = await studentService.findStudentWithIdentifier({ _id: req.params.id, userId });
      if (!existingData || existingData.length === 0) {
        throw new Error("Student not found or access denied");
      }
      const student = existingData[0];

      // Helper to handle Array or Object
      const getData = (data: any) => {
        if (Array.isArray(data)) return data[0];
        return data;
      };

      // 3. Update Guardian
      if (req.body.guardian) {
        const guardianId = student.guardian?.[0]?._id;
        const guardianBody = getData(req.body.guardian);

        if (guardianId && guardianBody) {
          await guardianService.updateGuardian({ ...guardianBody, _id: guardianId }, session);
        } else if (!guardianId && guardianBody) {
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
          await addressService.updateAddress({ ...addressBody, _id: addressId }, session);
        }
      }

      // 5. Update Previous Madrasa Info (support both 'madrasa' and 'oldMadrasaInfo')
      const madrasaPayload = req.body.madrasa || req.body.oldMadrasaInfo;
      if (madrasaPayload) {
        const madrasaId = student.oldMadrasaInfo?.[0]?._id;
        const madrasaBody = getData(madrasaPayload);

        if (madrasaId && madrasaBody) {
          await madrasaService.updateMadrasaInfo({ ...madrasaBody, _id: madrasaId }, session);
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

      await session.commitTransaction();

      // Return updated data
      const finalData = await studentService.findStudentWithIdentifier({ _id: req.params.id });

      return res.status(200).json({
        status: 200, // Changed from 201 to 200 for update
        success: true,
        messages: "student data updated", // simplified message to match user expectation
        data: finalData[0],
      });

    } catch (error: unknown) {
      await session.abortTransaction();
      next(error as Error);
    } finally {
      session.endSession();
    }
  }

  async filterAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any).id;
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
    } catch (error: unknown) {
      next(error as Error);
    }
  }

  async saveDraft(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    let isTransactionStarted = false;
    try {
      const userId = (req.user as any).id;

      const topologyType = (mongoose.connection.getClient() as any).topology?.description?.type;
      const supportsTransactions = topologyType === 'ReplicaSetWithPrimary' || topologyType === 'Sharded';

      if (supportsTransactions) {
        try {
          session.startTransaction();
          isTransactionStarted = true;
        } catch (transactionError) {
          console.warn("Failed to start transaction in saveDraft:", transactionError);
        }
      } else {
        console.warn(`Transactions not supported on MongoDB topology: ${topologyType}. Proceeding without transaction.`);
      }

      const activeSession = isTransactionStarted ? session : undefined;

      req.body.profileImage = (req as any).file ? `/uploads/${(req as any).file.filename}` : null;

      // Handle legacy payload (root fields) vs nested 'student' field
      let studentBody = req.body.student || {};
      // If student is array, take first (safeguard)
      if (Array.isArray(studentBody)) studentBody = studentBody[0];

      // Construct the unified draft payload
      const draftData = {
        ...req.body,                // Spread root properties (legacy/mix)
        ...studentBody,             // Spread structured student props (overrides root)

        // Explicitly map/ensure the nested arrays are taken from body
        // and assigned to the schema fields we just added.
        guardian: req.body.guardian,
        addresse: req.body.addresse || req.body.address, // Handle both
        fees: req.body.fees,
        oldMadrasaInfo: req.body.oldMadrasaInfo || req.body.madrasa, // Handle both

        status: 'draft',
        profileImage: req.body.profileImage,
        userId  // Add userId to draft data
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
        } else {
          return res.status(409).json({
            status: 409,
            success: false,
            message: "Cannot save draft: An active student already exists with this ID",
          });
        }
      } else {
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
    } catch (error: unknown) {
      if (isTransactionStarted) {
        await session.abortTransaction();
      }
      next(error as Error);
    } finally {
      session.endSession();
    }
  }
  async getDrafts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any).id;
      // Use aggregation to get populated details filtered by userId
      const results = await studentService.findDrafts(userId);
      return res.status(200).json({
        status: 200,
        message: "draft students",
        success: true,
        data: results,
      });
    } catch (error: unknown) {
      next(error as Error);
    }
  }

  async getDraftById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req.user as any).id;

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

    } catch (error: unknown) {
      next(error as Error);
    }
  }

  async deleteDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req.user as any).id;

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

    } catch (error: unknown) {
      next(error as Error);
    }
  }

  async updateDraft(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    let isTransactionStarted = false;
    try {
      const userId = (req.user as any).id;
      const { id } = req.params;

      const topologyType = (mongoose.connection.getClient() as any).topology?.description?.type;
      const supportsTransactions = topologyType === 'ReplicaSetWithPrimary' || topologyType === 'Sharded';

      if (supportsTransactions) {
        try {
          session.startTransaction();
          isTransactionStarted = true;
        } catch (transactionError) {
          console.warn("Failed to start transaction in updateDraft:", transactionError);
        }
      } else {
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
      if ((req as any).file) {
        draftData.profileImage = `/uploads/${(req as any).file.filename}`;
        // If there was an old image, delete it
        if (existingDraft.profileImage) {
          const oldImagePath = path.join(__dirname, '..', '..', existingDraft.profileImage);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
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
    } catch (error: unknown) {
      if (isTransactionStarted) {
        await session.abortTransaction();
      }
      next(error as Error);
    } finally {
      session.endSession();
    }
  }
}
