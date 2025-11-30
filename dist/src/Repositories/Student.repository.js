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
        return await this.model.aggregate([
            {
                $match: {
                    $or: [
                        { _id: new mongoose_1.Types.ObjectId(identifier._id) },
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
        ]);
    }
    async updateStudent(bodyData) {
        return await Student_model_1.default.updateOne({ _id: bodyData._id }, { $set: bodyData });
    }
}
exports.StudentRepostitory = StudentRepostitory;
