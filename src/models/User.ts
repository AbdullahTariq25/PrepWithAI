import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  username?: string;
  bio?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  currentRole?: string;
  targetRole?: string;
  experienceYears?: number;
  experienceLevel?: "student" | "junior" | "mid" | "senior" | "staff" | "principal";
  targetCompanies: string[];
  preferredInterviewTypes: string[];
  targetDate?: Date;
  resumeUrl?: string;
  resumeParsed?: Record<string, unknown>;
  plan: "free" | "pro" | "team" | "enterprise";
  planExpiresAt?: Date;
  proTrialStartedAt?: Date;
  proTrialEndsAt?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  emailNotifications: boolean;
  weeklyReport: boolean;
  voiceEnabled: boolean;
  preferredLanguage: string;
  timezone?: string;
  theme: "dark" | "light" | "system";
  totalSessions: number;
  avgScore: number;
  currentStreak: number;
  maxStreak: number;
  eloRating: number;
  lastActiveDate?: Date;
  onboarded: boolean;
  badges: string[];
  role: "user" | "admin";
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateStreak(): Promise<void>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      select: false,
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [128, "Password cannot exceed 128 characters"],
    },
    image: { type: String },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-z0-9_-]+$/, "Username can only contain lowercase letters, numbers, hyphens, underscores"],
    },
    bio: { type: String, maxlength: 500 },
    location: { type: String, maxlength: 100 },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    portfolioUrl: { type: String },
    currentRole: { type: String, maxlength: 100 },
    targetRole: { type: String, maxlength: 100 },
    experienceYears: { type: Number, min: 0, max: 50 },
    experienceLevel: {
      type: String,
      enum: ["student", "junior", "mid", "senior", "staff", "principal"],
    },
    targetCompanies: [{ type: String, trim: true }],
    preferredInterviewTypes: [{ type: String, trim: true }],
    targetDate: { type: Date },
    resumeUrl: { type: String },
    resumeParsed: { type: Schema.Types.Mixed },
    plan: {
      type: String,
      enum: ["free", "pro", "team", "enterprise"],
      default: "free",
    },
    planExpiresAt: { type: Date },
    proTrialStartedAt: { type: Date },
    proTrialEndsAt: { type: Date },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    emailNotifications: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: true },
    voiceEnabled: { type: Boolean, default: false },
    preferredLanguage: { type: String, default: "javascript" },
    timezone: { type: String },
    theme: { type: String, enum: ["dark", "light", "system"], default: "dark" },
    totalSessions: { type: Number, default: 0, min: 0 },
    avgScore: { type: Number, default: 0, min: 0, max: 100 },
    currentStreak: { type: Number, default: 0, min: 0 },
    maxStreak: { type: Number, default: 0, min: 0 },
    eloRating: { type: Number, default: 1200, min: 0 },
    lastActiveDate: { type: Date },
    onboarded: { type: Boolean, default: false },
    badges: [{ type: String }],
    role: { type: String, enum: ["user", "admin"], default: "user" },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  },
);

UserSchema.index({ eloRating: -1 });
UserSchema.index({ plan: 1 });
UserSchema.index({ lastActiveDate: -1 });
UserSchema.index({ createdAt: -1 });

UserSchema.pre("save", async function () {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  if (this.isModified("currentStreak") && this.currentStreak > this.maxStreak) {
    this.maxStreak = this.currentStreak;
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.updateStreak = async function (): Promise<void> {
  const now = new Date();
  const lastActive = this.lastActiveDate ? new Date(this.lastActiveDate) : null;

  if (!lastActive) {
    this.currentStreak = 1;
  } else {
    const diffMs = now.getTime() - lastActive.getTime();
    const diffDays = Math.floor(diffMs / 86_400_000);

    if (diffDays === 0) return;
    if (diffDays === 1) this.currentStreak += 1;
    else this.currentStreak = 1;
  }

  if (this.currentStreak > this.maxStreak) {
    this.maxStreak = this.currentStreak;
  }

  this.lastActiveDate = now;
  await this.save();
};

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
