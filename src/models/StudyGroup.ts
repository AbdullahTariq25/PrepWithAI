import mongoose, { Document, Model, Schema } from "mongoose";

export interface IStudyGroup extends Document {
  name: string;
  description: string;
  category: string;
  tags: string[];
  maxMembers: number;
  isPublic: boolean;
  ownerId: mongoose.Types.ObjectId;
  memberIds: mongoose.Types.ObjectId[];
  nextSessionAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudyGroupSchema = new Schema<IStudyGroup>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 80,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      maxlength: 60,
      default: "General",
      index: true,
    },
    tags: {
      type: [{ type: String, trim: true, maxlength: 30 }],
      validate: {
        validator: (value: string[]) => value.length <= 8,
        message: "A study group can have at most 8 tags",
      },
      default: [],
    },
    maxMembers: {
      type: Number,
      min: 2,
      max: 100,
      default: 20,
    },
    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    memberIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    nextSessionAt: { type: Date },
  },
  { timestamps: true },
);

StudyGroupSchema.index({ isPublic: 1, updatedAt: -1 });
StudyGroupSchema.index({ memberIds: 1, updatedAt: -1 });

const StudyGroup: Model<IStudyGroup> =
  mongoose.models.StudyGroup || mongoose.model<IStudyGroup>("StudyGroup", StudyGroupSchema);

export default StudyGroup;
