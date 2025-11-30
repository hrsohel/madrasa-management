import { Schema, model, Document } from 'mongoose';
const GENDER = ['Male', 'Female'] as const;
const BLOOD_GROUP = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
const SHIFT = ['Morning', 'Day', 'Evening'] as const;
const SECTION = ['A', 'B', 'C', 'D', 'Hifz', 'Nazira'] as const;
const DIVISION = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'] as const;

export interface IStudent extends Document {
  name: string;
  dob: Date;
  nid: string;
  birthCertificate: string;
  gender: typeof GENDER[number];
  bloodGroup: typeof BLOOD_GROUP[number];
  phone: string;
  uid: string;
  residential: string;
  roll: string;
  class: string;
  shift: typeof SHIFT[number];
  section: typeof SECTION[number];
  division: typeof DIVISION[number];
  session: string;
  createdAt?: Date;
  updatedAt?: Date;
  
}

const StudentSchema = new Schema<IStudent>(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    dob: {
      type: Date,
      required: [true, 'Date of birth is required'],
      validate: {
        validator: (date: Date) => date < new Date(),
        message: 'Date of birth cannot be in the future',
      },
    },

    nid: {
      type: String,
      unique: true,
      validate: {
        validator: (v: string) => /^\d{10,17}$/.test(v),
        message: 'Invalid NID/Birth Certificate number (10–17 digits)',
      },
    },

    birthCertificate: {
      type: String,
      unique: true,
      match: [/^\d{17}$/, 'Birth certificate must be exactly 17 digits'],
    },

    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: GENDER,
        message: 'Gender must be Male or Female',
      },
    },

    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: {
        values: BLOOD_GROUP,
        message: 'Invalid blood group',
      },
    },

    phone: {
      type: String,
      required: [true, 'Guardian phone is required'],
      validate: {
        validator: (v: string) => /^(\+8801|01)[3-9]\d{8}$/.test(v),
        message: 'Invalid Bangladeshi mobile number (e.g., 017XXXXXXXX)',
      },
    },

    uid: {
      type: String,
      required: [true, "ID is required"],
      unique: true,
      uppercase: true,
      match: [/^STD-\d{4}-\d{5}$/, 'UID must follow format: STD-2025-00001'],
    },

    residential: {
      type: String,
      required: [true, 'Residential status is required'],
      enum: {
        values: ['Day Scholar', 'Hostel', 'Residential'],
        message: 'Residential must be Day Scholar, Hostel or Residential',
      },
    },

    roll: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{4,6}$/, 'Roll must be numeric (e.g., 001 or 2025001)'],
    },

    class: {
      type: String,
      required: [true, 'Class is required']
    },

    shift: {
      type: String,
      required: [true, 'Shift is required'],
      enum: {
        values: SHIFT,
        message: 'Shift must be Morning, Day or Evening',
      },
    },

    section: {
      type: String,
      required: [true, 'Section is required']
    },

    division: {
      type: String,
      required: [true, 'Division is required']
    },

    session: {
      type: String,
      required: [true, 'Session is required'],
      match: [/^\d{2}-\d{2}$/, 'Session format must be YYYY-YY (e.g., 25-26)'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

StudentSchema.index({ class: 1, section: 1, session: 1 });
StudentSchema.index({ uid: 1 });
StudentSchema.index({ roll: 1 });

StudentSchema.virtual('age').get(function (this: IStudent) {
  if (!this.dob) return null;
  const today = new Date();
  const birthDate = new Date(this.dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

const Student = model<IStudent>('Student', StudentSchema);

export default Student;