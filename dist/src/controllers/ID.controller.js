"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDcontroller = void 0;
const IDs_model_1 = __importDefault(require("../models/IDs.model"));
class IDcontroller {
    async updateID(req, res, next) {
        try {
            const data = await IDs_model_1.default.findOneAndUpdate({ id: "HS" }, {
                $set: { id: "HS" }, // Ensure userId is set on insert
                $inc: { seq: 1 }
            }, { new: true, upsert: true });
            res.status(201).json({ status: 201, message: "ID", success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.IDcontroller = IDcontroller;
