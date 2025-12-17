"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Madrasa_model_1 = require("./src/models/Madrasa.model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyMadrasa = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URL);
        const userId = "6942a083c991321c3d0ee328"; // ID from curl output
        const madrasa = await Madrasa_model_1.Madrasa.findOne({ userId });
        if (madrasa) {
            console.log("Madrasa found:", JSON.stringify(madrasa, null, 2));
        }
        else {
            console.log("Madrasa NOT found for userId:", userId);
        }
    }
    catch (error) {
        console.error("Error:", error);
    }
    finally {
        await mongoose_1.default.disconnect();
    }
};
verifyMadrasa();
