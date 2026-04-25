import { Schema } from "mongoose";

export const TalentProfileSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    headline: { type: String, required: true },
    bio: { type: String },
    location: { type: String, required: true },

    skills: [
      {
        name: String,
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Expert"]
        },
        yearsOfExperience: Number
      }
    ],

    languages: [
      {
        name: String,
        proficiency: {
          type: String,
          enum: ["Basic", "Conversational", "Fluent", "Native"]
        }
      }
    ],

    certifications: [
      {
        name: String,
        issuer: String,
        issueDate: String
      }
    ],

    experience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
        technologies: [String],
        isCurrent: Boolean
      }
    ],

    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number
      }
    ],

    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        role: String,
        link: String,
        startDate: String,
        endDate: String
      }
    ],

    availability: {
      status: {
        type: String,
        enum: ["Available", "Open to Opportunities", "Not Available"]
      },
      type: {
        type: String,
        enum: ["Full-time", "Part-time", "Contract"]
      },
      startDate: String
    },

    socialLinks: {
      linkedin: String,
      github: String,
      portfolio: String
    },
    talentScore: {
      overallScore: { type: Number, default: 0 },
      breakdown: {
        skills: { type: Number, default: 0 },
        experience: { type: Number, default: 0 },
        education: { type: Number, default: 0 },
        projects: { type: Number, default: 0 },
        profileCompleteness: { type: Number, default: 0 }
      },
      summary: { type: String, default: "" },
    },
    jobDescription: { type: Schema.Types.ObjectId, ref: "JobDescription", default: null },
    status: {
        type: String,
        enum: ["Shortlisted", "Screened", "Rejected", "Emailed","Pending"],
        default: "Pending"
      },
  },
  {
    timestamps: true
  }
);