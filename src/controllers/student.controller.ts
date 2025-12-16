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
    console.log(req.body)
    const session = await mongoose.startSession();
    try {
      req.body.profileImage = (req as any).file ? `/uploads/${(req as any).file.filename}` : null
      session.startTransaction()
      const student = await studentService.addStudent({...req.body.student, profileImage: req.body.profileImage}, session)
      await guardianService.addGuardian({ ...req.body.guardian, student: student._id }, session)
      await addressService.addAddress({ ...req.body.address, student: student._id }, session)
      await madrasaService.addMadrasaInfo({ ...req.body.madrasa, student: student._id }, session)
      await feesService.addFees({ ...req.body.fees, student: student._id }, session)
      const feeFields = [
        "admissionFee",
        "booksFee",
        "ITFee",
        "IDCardFee",
        "libraryFee",
        "kafelaFee",
        "confirmFee",
      ];
      const totalFee = feeFields.reduce((sum, field) => {
        return sum + Number(req.body.fees[field] || 0);
      }, 0);

      const helpAmount = Number(req.body.fees.helpAmount || 0);

      const finalIncome = totalFee - helpAmount;
      // await incomeService.addIncome({amount: Math.abs(finalIncome), sectorName: "ভর্তি"}, session)
      // await expenseService.addExpense({amount: helpAmount, sectorName: req.body.fees.helpType}, session)
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
      const data = await studentService.findStudentWithIdentifier({
        _id: req.params.id,
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
      const updatedUser = await studentService.updateStudent({
        ...req.body,
        _id: req.params.id,
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
}
