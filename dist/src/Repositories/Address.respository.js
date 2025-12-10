"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressRepository = void 0;
const Address_model_1 = __importDefault(require("../models/Address.model"));
const BaseRepository_1 = require("./BaseRepository");
class AddressRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Address_model_1.default);
    }
    async updateAddress(bodyData) {
        return await Address_model_1.default.findOneAndUpdate({ _id: bodyData._id }, { $set: bodyData }, { new: true });
    }
}
exports.AddressRepository = AddressRepository;
