import { Schema, model, Document, Types } from 'mongoose';
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
  profileImage: string;
  userId: string;
  status: 'active' | 'draft' | 'archived';
  guardian?: any[];
  addresse?: any[];
  fees?: any;
  oldMadrasaInfo?: any[];
}

const StudentSchema = new Schema<IStudent>(
  {
    name: {
      type: String,
      // required: [true, 'Student name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    dob: {
      type: Date,
      // required: [true, 'Date of birth is required'],
      // validate: {
      //   validator: (date: Date) => date < new Date(),
      //   message: 'Date of birth cannot be in the future',
      // },
    },

    nid: {
      type: String,
      // unique: true,
      // validate: {
      //   validator: (v: string) => /^\d{10,17}$/.test(v),
      //   message: 'Invalid NID/Birth Certificate number (10–17 digits)',
      // },
    },

    birthCertificate: {
      type: String,
      // unique: true,
      // match: [/^\d{17}$/, 'Birth certificate must be exactly 17 digits'],
    },

    gender: {
      type: String,
      // required: [true, 'Gender is required'],
      enum: {
        values: GENDER,
        message: 'Gender must be Male or Female',
      },
    },

    bloodGroup: {
      type: String,
      // required: [true, 'Blood group is required'],
      enum: {
        values: BLOOD_GROUP,
        message: 'Invalid blood group',
      },
    },

    phone: {
      type: String,
      // required: [true, 'Guardian phone is required'],
      // validate: {
      //   validator: (v: string) => /^(\+8801|01)[3-9]\d{8}$/.test(v),
      //   message: 'Invalid Bangladeshi mobile number (e.g., 017XXXXXXXX)',
      // },
    },

    uid: {
      type: String,
      unique: true,
      uppercase: true,
    },
    residential: {
      type: String,
    },
    roll: {
      type: String,
      unique: true,
    },
    class: {
      type: String,
    },
    shift: {
      type: String,
    },
    section: {
      type: String,
    },
    division: {
      type: String,
    },
    session: {
      type: String,
    },
    profileImage: {
      type: String,
      default: null
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active'
    },
    // Embedded fields for drafts
    guardian: { type: [Schema.Types.Mixed], default: [] },
    addresse: { type: [Schema.Types.Mixed], default: [] },
    fees: { type: Schema.Types.Mixed, default: {} },
    oldMadrasaInfo: { type: [Schema.Types.Mixed], default: [] }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: false // Allow saving fields not defined in schema (for drafts)
  }
);

StudentSchema.index({ class: 1, section: 1, session: 1 });
// Removed duplicate uid and roll indices as they are marked unique: true

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