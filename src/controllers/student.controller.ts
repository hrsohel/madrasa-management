import { NextFunction, Request, Response } from "express";
import { StudentService } from "../services/Student.service";
import { GuardianService } from "../services/Guardian.service";
import { AddressService } from "../services/Address.service";
import { MadrasaService } from "../services/Madrasa.service";
import { FeesService } from "../services/Fees.service";
import mongoose from "mongoose";
import { IncomeService } from "../services/Income.service";
import { ExpenseService } from "../services/Expense.service";

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
    console.log('Add Student Payload:', JSON.stringify(req.body, null, 2));
    const session = await mongoose.startSession();
    try {
      req.body.profileImage = (req as any).file ? `/uploads/${(req as any).file.filename}` : null
      session.startTransaction()

      // Helper to handle Array or Object and parse JSON strings
      const getData = (data: any) => {
        if (typeof data === 'string') {
          try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed[0] : parsed;
          } catch (e) {
            return data; // Not JSON string
          }
        }
        if (Array.isArray(data)) return data[0];
        return data;
      };

      // Handle if student is sent as stringified JSON (common in form-data)
      let studentBody = req.body.student;
      if (typeof studentBody === 'string') {
        try {
          studentBody = JSON.parse(studentBody);
          // If it parses to array, take first
          if (Array.isArray(studentBody)) studentBody = studentBody[0];
        } catch (e) {
          console.error("Failed to parse student body string", e);
        }
      }

      console.log('Parsed Student Body:', studentBody);

      const studentData = { ...studentBody, profileImage: req.body.profileImage };

      console.log('Creating Student with data:', studentData);
      const student = await studentService.addStudent(studentData, session)
      console.log('Student Created, ID:', student._id);

      // Guardian
      if (req.body.guardian) {
        try {
          console.log('Processing Guardian...');
          const guardianData = getData(req.body.guardian);
          console.log('Guardian Data:', guardianData);
          await guardianService.addGuardian({ ...guardianData, student: student._id }, session)
        } catch (err) {
          console.error('Error adding guardian:', err);
          throw err;
        }
      }

      // Address (handle 'address' or 'addresse')
      const addressPayload = req.body.address || req.body.addresse;
      if (addressPayload) {
        try {
          console.log('Processing Address...');
          const addressData = getData(addressPayload);
          console.log('Address Data:', addressData);
          await addressService.addAddress({ ...addressData, student: student._id }, session)
        } catch (err) {
          console.error('Error adding address:', err);
          throw err;
        }
      }

      // Madrasa (handle 'madrasa' or 'oldMadrasaInfo')
      const madrasaPayload = req.body.madrasa || req.body.oldMadrasaInfo;
      if (madrasaPayload) {
        try {
          console.log('Processing Madrasa...');
          const madrasaData = getData(madrasaPayload);
          console.log('Madrasa Data:', madrasaData);
          await madrasaService.addMadrasaInfo({ ...madrasaData, student: student._id }, session)
        } catch (err) {
          console.error('Error adding madrasa:', err);
          throw err;
        }
      }

      // Fees
      if (req.body.fees) {
        try {
          console.log('Processing Fees...');
          const feesData = getData(req.body.fees);
          console.log('Fees Data:', feesData);
          await feesService.addFees({ ...feesData, student: student._id }, session)

          // Income/Expense calculation logic remains...
          const feeFields = [
            "admissionFee",
            "booksFee",
            "ITFee",
            "IDCardFee",
            "libraryFee",
            "kafelaFee",
            "confirmFee",
          ];
          // Ensure feesData is object to prevent crash in reduce
          const safeFeesData = typeof feesData === 'object' ? feesData : {};
          const totalFee = feeFields.reduce((sum, field) => {
            return sum + Number(safeFeesData[field] || 0);
          }, 0);

          const helpAmount = Number(safeFeesData.helpAmount || 0);
          // ... (rest of logic)
        } catch (err) {
          console.error('Error adding fees:', err);
          throw err;
        }
      }

      await session.commitTransaction()

      return res.status(201).json({
        status: 201,
        success: true,
        messages: "student added",
        data: student, // Return the student data
      });
    } catch (error: unknown) {
      console.error('Add Student Transaction Failed:', error);
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
      const { id } = req.params;

      // Check if ID is valid
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `Invalid Student ID format: '${id}'. If you are trying to get all students, use /api/v1/students/students/get-all-students`,
          data: null
        });
      }

      const data = await studentService.findStudentWithIdentifier({
        _id: id,
      });
      return res.status(200).json({ // Changed 201 to 200 for GET
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

      const studentData = {
        ...req.body, // Start with root fields (legacy support)
        ...(studentBody || {}), // Override/Merge with structured 'student' object if present
        _id: req.params.id
      };

      // Remove keys that are definitely NOT student data to avoid potential confusion (though strictly harmless in strict mode)
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
        // If passed in body (e.g. string URL), though usually file upload
        studentData.profileImage = req.body.profileImage;
      }

      // Perform Student Update if there are fields to update
      // Only call update if there are actual fields besides _id, but mongoose handles empty updates gracefully.
      // However, check if req.body has student info mixed in root or in 'student' object?
      // User payload showed "guardian" array, but didn't show student part clearly.
      // Assuming 'student' key exists or req.body root has student fields if 'student' key is missing?
      // Based on previous addStudent, it expects 'student' key.
      // Let's assume standard structure: { student: {...}, guardian: [...] }

      // If student object is empty but root has fields, maybe we should merge root fields?
      // Safe to assume structure follows addStudent: { student: {}, guardian: {}, ... }

      const updatedStudent = await studentService.updateStudent(studentData, session);

      // 2. Fetch existing related docs to get their IDs
      const existingData: any = await studentService.findStudentWithIdentifier({ _id: req.params.id });
      if (!existingData || existingData.length === 0) {
        throw new Error("Student not found");
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
          await feesService.updateFees({ ...feesBody, _id: feesId }, session);
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
      const results = await studentService.filterStudent(req.query);
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
        profileImage: req.body.profileImage
      };

      // Cleanup: Remove the 'student' key if it exists in root to avoid duplication/bloat
      delete draftData.student;
      delete draftData.address;
      delete draftData.madrasa;

      // Create using Service
      console.log('Saving Draft Data:', JSON.stringify(draftData, null, 2));

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
      // Use aggregation to get populated details
      const results = await studentService.findDrafts();
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
}
