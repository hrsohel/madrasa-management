
import { Document, model, Schema, Types } from "mongoose";

export interface IExpense extends Document {
    roshidNo: string
    donorName: string
    amount: number
    sectorName: string
    method: string
    receiptIssuer: string
    additionalNotes: string
    userId: Types.ObjectId;
}

const ExpenseSchema = new Schema<IExpense>({
    roshidNo: {
        type: String,
        default: () => `E-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        unique: true
    },
    donorName: {
        type: String,
        default: null,
    },
    amount: {
        type: Number,
        default: 0,
        min: [0, "amount must not be less than 0"]
    },
    sectorName: {
        type: String,
        default: null
    },
    method: {
        type: String,
        default: null
    },
    receiptIssuer: {
        type: String,
        default: null
    },
    additionalNotes: {
        type: String,
        default: null
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true })

const Expense = model<IExpense>("Expense", ExpenseSchema)

export default Expense