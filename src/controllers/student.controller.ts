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

      return res.status(201).json({
        status: 201,
        success: true,
        messages: "student added",
        data: [],
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
    try {
      const userId = (req.user as any).id;
      if ((req as any).file) {
        // Fetch existing student to get old image path
        const existingStudent = await studentService.findStudentWithIdentifier({
          _id: req.params.id,
          userId
        });

        if (existingStudent && Array.isArray(existingStudent) && existingStudent.length > 0 && existingStudent[0].profileImage) {
          const oldImagePath = path.join(process.cwd(), existingStudent[0].profileImage);
          // profileImage is stored as '/uploads/filename', so path.join with cwd might need adjustment if cwd is project root and uploads is at root. 
          // Better to strip leading slash if present to avoid absolute path confusion, or just join carefully.
          // Assumes storage is in {ProjectRoot}/uploads based on addStudent logic (req.file.filename).

          try {
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          } catch (err) {
            console.error("Error deleting old image:", err);
            // Proceed even if delete fails
          }
        }
        req.body.profileImage = `/uploads/${(req as any).file.filename}`;
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
    } catch (error: unknown) {
      next(error as Error);
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
}
