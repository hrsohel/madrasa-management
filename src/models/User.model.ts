import { Schema, model, Document, CallbackWithoutResultAndOptionalError, PreSaveMiddlewareFunction } from "mongoose";
import { UserRole } from "../constants/user.constants";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  totalStudents: string
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    totalStudents: {
      type: String,
      default: "0"
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", (async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
}) as PreSaveMiddlewareFunction<IUser>);

const User = model<IUser>("User", userSchema);

export default User;
