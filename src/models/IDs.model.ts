import { Document, model, Schema } from "mongoose";

export interface IID extends Document {
    id: string
    seq: number
}

const IDSchema = new Schema<IID>({
    id: { type: String },
    seq: { type: Number }
})

const ID = model<IID>("ID", IDSchema)

export default ID