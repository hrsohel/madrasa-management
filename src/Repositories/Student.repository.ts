import { Types } from "mongoose";
import Student, { IStudent } from "../models/Student.model";
import { BaseRepository } from "./BaseRepository";

export class StudentRepostitory extends BaseRepository<IStudent> {
    constructor() {
        super(Student)
    }
    async findStudentsWithPolulated(identifier: any) {
        return await this.model.aggregate([
            {
                $match: {
                    $or: [
                        { _id: new Types.ObjectId(identifier._id as string) },
                        { roll: identifier.roll },
                        { uid: identifier.uid }
                    ]
                }
            },
            {
                $lookup: {
                    from: "guardians",
                    localField: "_id",
                    foreignField: "student",
                    as: "guardian"
                }
            },
            {
                $lookup: {
                    from: "addresses",
                    localField: "_id",
                    foreignField: "student",
                    as: "addresse"
                }
            },
            {
                $lookup: {
                    from: "oldmadrasainfos",
                    localField: "_id",
                    foreignField: "student",
                    as: "oldMadrasaInfo"
                }
            },
            {
                $lookup: {
                    from: "fees",
                    localField: "_id",
                    foreignField: "student",
                    as: "fees"
                }
            }
        ])
    }

    async updateStudent(bodyData: any) {
        return await Student.findOneAndUpdate({_id: bodyData._id}, {$set: bodyData}, {new: true})
    }
}