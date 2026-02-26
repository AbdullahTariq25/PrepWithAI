import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  plan: "free" | "pro" | "team";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  resumeUrl?: string;
  resumeParsed?: {
    name: string;
    skills: string[];
    projects: { name: string; description: string; tech: string[] }[];
    experience: { title: string; company: string; duration: string; description: string }[];
    education: { degree: string; school: string; year: string }[];
    summary: string;
  };
  totalSessions: number;
  avgScore: number;
  streak: number;
  lastActiveDate?: Date;
  onboarded: boolean;
  targetCompany?: string;
  experienceLevel?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    plan: { type: String, enum: ["free", "pro", "team"], default: "free" },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    resumeUrl: { type: String },
    resumeParsed: { type: Schema.Types.Mixed },
    totalSessions: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    onboarded: { type: Boolean, default: false },
    targetCompany: { type: String },
    experienceLevel: { type: String },
  },
  { timestamps: true }
);

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
