"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRepostitory = void 0;
const mongoose_1 = require("mongoose");
const Student_model_1 = __importDefault(require("../models/Student.model"));
const BaseRepository_1 = require("./BaseRepository");
class StudentRepostitory extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Student_model_1.default);
    }
    async findStudentsWithPolulated(identifier) {
        console.log('Repository identifier:', identifier);
        // Build the match query
        const matchQuery = {
            userId: identifier.userId,
            status: identifier.status || 'active' // Filter for active by default
        };
        // Add _id, roll, or uid to match
        if (identifier._id) {
            matchQuery._id = new mongoose_1.Types.ObjectId(identifier._id);
        }
        else if (identifier.roll) {
            matchQuery.roll = identifier.roll;
        }
        else if (identifier.uid) {
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
        ]);
    }
    async updateStudent(bodyData, session) {
        return await Student_model_1.default.findOneAndUpdate({ _id: bodyData._id }, { $set: bodyData }, { new: true, session });
    }
    async findDraftsWithDetails(userId) {
        return await this.model.find({
            status: 'draft',
            userId: userId
        }).sort({ createdAt: -1 });
    }
    async deleteStudent(_id) {
        return await this.model.findByIdAndDelete(_id);
    }
}
exports.StudentRepostitory = StudentRepostitory;
