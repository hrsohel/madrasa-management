import User, { IUser } from "../models/User.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password as string);
  console.log(user.password, password, isPasswordMatch)
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user._id, role: user.role }, "your-secret-key", {
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
  return newUser;
};

const getAllUsers = async () => {
  const users = await User.find().select("-password"); // Exclude password from the results
  return users;
};

export const UserService = {
  login,
  signUp,
  getAllUsers,
};
