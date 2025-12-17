import { Types, ClientSession } from "mongoose";
import Student, { IStudent } from "../models/Student.model";
import { BaseRepository } from "./BaseRepository";

export class StudentRepostitory extends BaseRepository<IStudent> {
    constructor() {
        super(Student)
    }
    async findStudentsWithPolulated(identifier: any) {
        const orConditions = [];
        if (identifier._id) orConditions.push({ _id: new Types.ObjectId(identifier._id as string) });
        if (identifier.roll) orConditions.push({ roll: identifier.roll });
        if (identifier.uid) orConditions.push({ uid: identifier.uid });

        if (orConditions.length === 0) {
            throw new Error("No valid identifier provided for student lookup");
        }

        return await this.model.aggregate([
            {
                $match: {
                    $or: orConditions
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

    async updateStudent(bodyData: any, session?: ClientSession) {
        return await Student.findOneAndUpdate({ _id: bodyData._id }, { $set: bodyData }, { new: true, session })
    }

    async findDraftsWithDetails() {
        return await this.model.aggregate([
            {
                $match: { status: 'draft' }
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
        ]);
    }

    async deleteStudent(_id: string) {
        return await this.model.findByIdAndDelete(_id);
    }
}