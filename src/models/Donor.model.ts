import { Document, model, Schema, Types } from "mongoose";

export interface IDonor extends Document {
    donorName: string
    amountPerStep: number
    phone: string
    address: string;
    userId: Types.ObjectId;
}

const DonorSchema = new Schema<IDonor>({
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
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
})

const Donor = model<IDonor>("Donor", DonorSchema)

export default Donor