import { Document, model, Schema } from "mongoose";

export interface IExpense extends Document {
    roshidNo: string
    donorName: string
    amount: number
    sectorName: string
    method: string
    receiptIssuer: string
    additionalNotes: string
}

const ExpenseSchema = new Schema<IExpense>({
    roshidNo: {
        type: String,
        default: null
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
    }
}, {timestamps: true})

const Expense = model<IExpense>("Expense", ExpenseSchema)

export default Expense