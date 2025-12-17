import User, { IUser } from "../models/User.model";
import { Madrasa } from "../models/Madrasa.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail";
import { getWelcomeEmailHtml } from "../utils/emailTemplates";

const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password as string);
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.TOKEN_SECRET as string, {
    expiresIn: "1d",
  });

  return {
    user,
    token,
  };
};

const signUp = async (userData: IUser) => {
  const { fullName, email, password, role } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // The password hashing is now handled by the pre-save hook in the User model
  const newUser = new User({
    fullName,
    email,
    password, // Password will be hashed by the pre-save hook
    role,
  });

  await newUser.save();

  await Madrasa.create({
    name: {
      bangla: "My Madrasa",
      english: "My Madrasa",
    },
    location: {
      bangla: "Madrasa Location",
      english: "Madrasa Location",
    },
    contact: {
      email: newUser.email,
      phone: "01000000000",
    },
    userId: newUser._id,
  });

  const emailHtml = getWelcomeEmailHtml(password);
  await sendEmail(
    newUser.email,
    "Welcome to Madrasa Management - Your Account Created",
    `Welcome! Your password is: ${password}`,
    emailHtml
  );

  return newUser;
};

const getAllUsers = async () => {
  const users = await User.find().select("-password"); // Exclude password from the results
  return users;
};

const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error("User not found");
  }
  await Madrasa.deleteOne({ userId });
  return user;
};

const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password as string);
  if (!isPasswordMatch) {
    throw new Error("Invalid old password");
  }

  // Pre-save hook will hash this
  user.password = newPassword;
  await user.save();

  return { message: "Password changed successfully" };
};

export const UserService = {
  login,
  signUp,
  getAllUsers,
  deleteUser,
  changePassword,
};
