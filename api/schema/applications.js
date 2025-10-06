import { Schema, model, Types } from "mongoose";

export const STATUSES = [
  "backlog",
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
];

const applicationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    status: {
      type: String,
      enum: STATUSES,
      required: true,
      default: "backlog",
    },
    position: { type: Number, default: 0 },
    cvVersion: { type: String },
    coverLetterVersion: { type: String },
    jobUrl: { type: String },
    jobDescription: { type: String },
    contact: {
      name: String,
      email: String,
      phone: String,
    },
    tags: [{ type: String }],
    appliedAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

applicationSchema.index({
  jobTitle: "text",
  companyName: "text",
  jobDescription: "text",
});

applicationSchema.index({ user: 1 });
applicationSchema.index({ status: 1, position: 1 });
applicationSchema.index({ appliedAt: -1 });

const Application = model("Application", applicationSchema);

export default Application;
