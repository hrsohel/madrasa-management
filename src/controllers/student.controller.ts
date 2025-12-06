import { NextFunction, Request, Response } from "express";
import { StudentService } from "../services/Student.service";
import { GuardianService } from "../services/Guardian.service";
import { AddressService } from "../services/Address.service";
import { MadrasaService } from "../services/Madrasa.service";
import { FeesService } from "../services/Fees.service";
import mongoose from "mongoose";

const studentService = new StudentService()
const guardianService = new GuardianService()
const addressService = new AddressService()
const madrasaService = new MadrasaService()
const feesService = new FeesService()

export class StudentController {
    async addStudent(req: Request, res: Response, next: NextFunction) {
        const session = await mongoose.startSession()
        try {
            session.startTransaction()
            const student = await studentService.addStudent(req.body.student)
            await guardianService.addGuardian({ ...req.body.guardian, student: student._id })
            await addressService.addAddress({ ...req.body.address, student: student._id })
            await madrasaService.addMadrasaInfo({ ...req.body.madrasa, student: student._id })
            await feesService.addFees({ ...req.body.fees, student: student._id })
            session.commitTransaction()
            return res.status(201).json({
                status: 201,
                success: true,
                messages: "student added",
                data: []
            })
        } catch (error: unknown) {
            session.abortTransaction()
            next(error as Error)
        }
    }
    async getStudentWithPopulated(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await studentService.findStudentWithIdentifier({_id: req.params.id})
            return res.status(201).json({
                status: 200,
                success: true,
                messages: "student data",
                data: data
            })
        } catch (error: unknown) {
            next(error as Error)
        }
    }

    async updateStudent(req: Request, res: Response, next: NextFunction) {
        try {
            const updatedUser = await studentService.updateStudent({...req.body, _id: req.params.id})
            return res.status(201).json({
                status: 201,
                success: true,
                messages: "student data updated",
                data: updatedUser
            })
        } catch (error: unknown) {
            next(error as Error)
        }
    }

    async filterAllStudents(req: Request, res: Response, next: NextFunction) {
        try {
            const results = await studentService.filterStudent(req.query)
            return res.status(200).json({
                status: 200,
                message: "all student data",
                success: true,
                data: results
            })
        } catch (error: unknown) {
            next(error as Error)
        }
    }
}