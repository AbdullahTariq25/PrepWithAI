import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  bio?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  username?: string;
  plan: "free" | "pro" | "team" | "enterprise";
  planExpiresAt?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentRole?: string;
  targetRole?: string;
  experienceYears?: number;
  targetCompanies: string[];
  targetDate?: Date;
  experienceLevel?: string;
  resumeUrl?: string;
  resumeParsed?: Record<string, unknown>;
  emailNotifications: boolean;
  weeklyReport: boolean;
  voiceEnabled: boolean;
  preferredLanguage: string;
  timezone?: string;
  totalSessions: number;
  avgScore: number;
  currentStreak: number;
  maxStreak: number;
  eloRating: number;
  lastActiveDate?: Date;
  onboarded: boolean;
  badges: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    image: { type: String },
    bio: { type: String, maxlength: 500 },
    location: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    username: { type: String, unique: true, sparse: true },
    plan: {
      type: String,
      enum: ["free", "pro", "team", "enterprise"],
      default: "free",
    },
    planExpiresAt: { type: Date },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    currentRole: { type: String },
    targetRole: { type: String },
    experienceYears: { type: Number },
    targetCompanies: [{ type: String }],
    targetDate: { type: Date },
    experienceLevel: { type: String },
    resumeUrl: { type: String },
    resumeParsed: { type: Schema.Types.Mixed },
    emailNotifications: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: true },
    voiceEnabled: { type: Boolean, default: false },
    preferredLanguage: { type: String, default: "javascript" },
    timezone: { type: String },
    totalSessions: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
    eloRating: { type: Number, default: 1200 },
    lastActiveDate: { type: Date },
    onboarded: { type: Boolean, default: false },
    badges: [{ type: String }],
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ eloRating: -1 });

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
