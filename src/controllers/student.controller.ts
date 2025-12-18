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
    try {
      const userId = (req.user as any).id;
      req.body.profileImage = (req as any).file ? `/uploads/${(req as any).file.filename}` : null
      session.startTransaction()
      const student = await studentService.addStudent({ ...req.body.student, profileImage: req.body.profileImage, userId }, session)
      await guardianService.addGuardian({ ...req.body.guardian, student: student._id, userId }, session)
      await addressService.addAddress({ ...req.body.address, student: student._id, userId }, session)
      await madrasaService.addMadrasaInfo({ ...req.body.madrasa, student: student._id, userId }, session)
      await feesService.addFees({ ...req.body.fees, student: student._id, userId }, session)
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

      await session.commitTransaction()

      // Fetch the newly created student with all its populated details for the response
      const populatedStudent = await studentService.findStudentWithIdentifier({ _id: student._id, userId });

      return res.status(201).json({
        status: 201,
        success: true,
        messages: "student added",
        data: populatedStudent[0], // findStudentWithIdentifier returns an array
      });
    } catch (error: unknown) {
      await session.abortTransaction();
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
      const results = await studentService.filterStudent({ ...req.query, userId });
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
    try {
      const userId = (req.user as any).id;
      session.startTransaction();

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

      const student = await studentService.addStudent(draftData, session);

      await session.commitTransaction();

      return res.status(201).json({
        status: 201, // Created
        success: true,
        messages: "Draft saved successfully",
        data: student,
      });
    } catch (error: unknown) {
      await session.abortTransaction();
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
      if (student.userId !== userId) {
        return res.status(403).json({
          status: 403,
          success: false,
          message: "Access denied"
        });
      }

      // Optional: Verify status is draft? 
      // If user wants to "edit" a draft, they need the data regardless.
      if (student.status !== 'draft') {
        // Maybe warn or redirect? 
        // For now, return it but maybe checking status is good practice.
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
    try {
      const userId = (req.user as any).id;
      const { id } = req.params;
      session.startTransaction();

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


      const student = await studentService.updateStudent({ ...draftData, _id: id }, session);

      await session.commitTransaction();

      return res.status(200).json({
        status: 200,
        success: true,
        messages: "Draft updated successfully",
        data: student,
      });
    } catch (error: unknown) {
      await session.abortTransaction();
      next(error as Error);
    } finally {
      session.endSession();
    }
  }
}
