// ===========================================
// PrepWithAI — User Model
// Production-grade, comprehensive user schema
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// ─── Interface ──────────────────────────────────────

export interface IUser extends Document {
  // Identity
  name: string;
  email: string;
  password?: string;
  image?: string;
  username?: string;

  // Profile
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
  targetDate?: Date;
  resumeUrl?: string;
  resumeParsed?: Record<string, unknown>;

  // Subscription
  plan: "free" | "pro" | "team" | "enterprise";
  planExpiresAt?: Date;
  proTrialStartedAt?: Date;
  proTrialEndsAt?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;

  // Preferences
  emailNotifications: boolean;
  weeklyReport: boolean;
  voiceEnabled: boolean;
  preferredLanguage: string;
  timezone?: string;
  theme: "dark" | "light" | "system";

  // Stats (denormalized for fast reads)
  totalSessions: number;
  avgScore: number;
  currentStreak: number;
  maxStreak: number;
  eloRating: number;
  lastActiveDate?: Date;

  // System
  onboarded: boolean;
  badges: string[];
  role: "user" | "admin";
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateStreak(): Promise<void>;
}

// ─── Schema ─────────────────────────────────────────

const UserSchema = new Schema<IUser>(
  {
    // Identity
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
      minlength: [6, "Password must be at least 6 characters"],
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

    // Profile
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
    targetDate: { type: Date },
    resumeUrl: { type: String },
    resumeParsed: { type: Schema.Types.Mixed },

    // Subscription
    plan: {
      type: String,
      enum: ["free", "pro", "team", "enterprise"],
      default: "pro",
    },
    planExpiresAt: { type: Date },
    proTrialStartedAt: { type: Date },
    proTrialEndsAt: { type: Date },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },

    // Preferences
    emailNotifications: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: true },
    voiceEnabled: { type: Boolean, default: false },
    preferredLanguage: { type: String, default: "javascript" },
    timezone: { type: String },
    theme: { type: String, enum: ["dark", "light", "system"], default: "dark" },

    // Stats
    totalSessions: { type: Number, default: 0, min: 0 },
    avgScore: { type: Number, default: 0, min: 0, max: 100 },
    currentStreak: { type: Number, default: 0, min: 0 },
    maxStreak: { type: Number, default: 0, min: 0 },
    eloRating: { type: Number, default: 1200, min: 0 },
    lastActiveDate: { type: Date },

    // System
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
  }
);

// ─── Indexes ────────────────────────────────────────

// email and username indexes are already defined via field-level unique:true
UserSchema.index({ eloRating: -1 });
UserSchema.index({ plan: 1 });
UserSchema.index({ lastActiveDate: -1 });
UserSchema.index({ createdAt: -1 });

// ─── Pre-save Middleware ────────────────────────────

UserSchema.pre("save", async function () {
  // Hash password if modified
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // Ensure maxStreak stays in sync
  if (this.isModified("currentStreak") && this.currentStreak > this.maxStreak) {
    this.maxStreak = this.currentStreak;
  }
});

// ─── Instance Methods ───────────────────────────────

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
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day — no change
      return;
    } else if (diffDays === 1) {
      // Consecutive day — increment
      this.currentStreak += 1;
    } else {
      // Streak broken
      this.currentStreak = 1;
    }
  }

  if (this.currentStreak > this.maxStreak) {
    this.maxStreak = this.currentStreak;
  }

  this.lastActiveDate = now;
  await this.save();
};

// ─── Export ─────────────────────────────────────────

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
