"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const IDSchema = new mongoose_1.Schema({
    id: { type: String },
    seq: { type: Number }
});
const ID = (0, mongoose_1.model)("ID", IDSchema);
exports.default = ID;
