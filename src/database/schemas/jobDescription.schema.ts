import { Schema } from "mongoose";

export const JobDescriptionSchema = new Schema(
  {
    jobTitle: { type: String, required: true },
    department: { type: String, required: true },
    description: { type: String, required: true, unique: true },
    requiredSkills: [
      {
        name: String,
        minLevel: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Expert"]
        },
        yearsRequired: Number
      }
    ],
    experienceLevel: {
      type: String,
      enum: ["Entry-level", "Mid-level", "Senior", "Lead"],
      default: "Mid-level"
    },
    yearsOfExperienceRequired: { type: Number, default: 0 },
    salaryRange: {
      min: Number,
      max: Number,
      currency: { type: String, default: "USD" }
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Temporary"],
      default: "Full-time"
    },
    location: String,
    isRemote: { type: Boolean, default: false },
    responsibilities: [String],
    benefits: [String]
  },
  {
    timestamps: true
  }
);