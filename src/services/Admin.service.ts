import { Madrasa } from "../models/Madrasa.model";
import Student from "../models/Student.model";
import User from "../models/User.model";
import { UserRole } from "../constants/user.constants";
import { sendEmail } from "../utils/sendEmail";
import bcrypt from "bcrypt";

const getAdminPanelData = async () => {
  const madrasa = await Madrasa.findOne();
  const totalStudents = await Student.countDocuments();

  if (!madrasa) {
    throw new Error("Madrasa not found");
  }

  return {
    institutionName: madrasa.name,
    totalStudents,
    accountOpeningDate: madrasa.createdAt,
  };
};

const createNewInstitution = async (
  email: string,
  password: string,
  institutionName: string,
  totalStudents: string
) => {
  // 1. Create a new admin user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    fullName: institutionName, // Or a default admin name
    email,
    password: hashedPassword,
    totalStudents,
    role: UserRole.ADMIN,
  });
  await newUser.save();

  // 2. Create a new madrasa
  // const newMadrasa = new Madrasa({
  //   name: {
  //       bangla: institutionName,
  //       english: institutionName,
  //   },
  //   contact: {
  //       email: email,
  //       phone: "" // Assuming phone will be updated later
  //   },
  //   location: {
  //       bangla: "Default Location",
  //       english: "Default Location"
  //   }
  // });
  // await newMadrasa.save();

  // 3. Send an email with credentials
  const emailSubject = "Your New Institution Account Credentials";
  const emailText = `Hello ${institutionName},\n\nYour new institution account has been created.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease login and change your password.\n\nThank you!`;
  await sendEmail(email, emailSubject, emailText);

  return {
    user: newUser,
  };
};

export const AdminService = {
  getAdminPanelData,
  createNewInstitution,
};
