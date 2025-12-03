import { Document, model, Schema } from "mongoose";

export interface IDonor extends Document {
    donorName: string
    amountPerStep: number
    phone: string
    address: string
}

const DonorSchema = new  Schema<IDonor>({
    donorName: {
        type: String,
        default: null
    },
    amountPerStep: {
        type: Number,
        default: 0,
        min: [0, "amount must be less than 0"]
    },
    phone: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    }
})

const Donor = model<IDonor>("Donor", DonorSchema)

export default Donor