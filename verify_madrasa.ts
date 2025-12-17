import mongoose from 'mongoose';
import { Madrasa } from './src/models/Madrasa.model';
import dotenv from 'dotenv';
dotenv.config();

const verifyMadrasa = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        const userId = "6942a083c991321c3d0ee328"; // ID from curl output
        const madrasa = await Madrasa.findOne({ userId });
        if (madrasa) {
            console.log("Madrasa found:", JSON.stringify(madrasa, null, 2));
        } else {
            console.log("Madrasa NOT found for userId:", userId);
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

verifyMadrasa();
