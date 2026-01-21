import { Types, ClientSession } from "mongoose";
import Student, { IStudent } from "../models/Student.model";
import { BaseRepository } from "./BaseRepository";

export class StudentRepostitory extends BaseRepository<IStudent> {
    constructor() {
        super(Student)
    }
    async findStudentsWithPolulated(identifier: any) {
        console.log('Repository identifier:', identifier);

        // Build the match query
        const matchQuery: any = {
            userId: identifier.userId,
            status: identifier.status || 'active' // Filter for active by default
        };

        // Add _id, roll, or uid to match
        if (identifier._id) {
            matchQuery._id = new Types.ObjectId(identifier._id as string);
        } else if (identifier.roll) {
            matchQuery.roll = identifier.roll;
        } else if (identifier.uid) {
            matchQuery.uid = identifier.uid;
        }

        console.log('Match query:', matchQuery);

        return await this.model.aggregate([
            {
                $match: matchQuery
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

    async findDraftsWithDetails(userId: string) {
        return await this.model.find({
            status: 'draft',
            userId: userId
        }).sort({ createdAt: -1 });
    }

    async deleteStudent(_id: string) {
        return await this.model.findByIdAndDelete(_id);
    }
}