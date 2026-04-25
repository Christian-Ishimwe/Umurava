import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { TalentProfileType, TalentScore } from "../types/talent.types";
import { JobDescriptionInfoType } from "../types/jobDescriptionInfo.type";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
});

export const parseResumeWithGemini = async (text: any) => {
    const prompt = `
You are an AI recruiter assistant.

Extract structured data from this resume.

IMPORTANT RULES:
- Return ONLY valid JSON
- NO markdown
- NO \`\`\`json
- NO explanations

Schema:
{
  "firstName": string,
  "lastName": string,
  "email": string,
  "headline": string,
  "bio": string,
  "location": string,
  "skills": [
    {
      "name": string,
      "level": "Beginner" | "Intermediate" | "Advanced" | "Expert",
      "yearsOfExperience": number
    }
  ],
  "languages": [
    {
      "name": string,
      "proficiency": "Basic" | "Conversational" | "Fluent" | "Native"
    }
  ],
  "certifications": [
    {
      "name": string,
      "issuer": string,
      "issueDate": string
    }
  ],
  "experience": [
    {
      "company": string,
      "role": string,
      "startDate": string,
      "endDate": string,
      "description": string,
      "technologies": string[],
      "isCurrent": boolean
    }
  ],
  "education": [
    {
      "institution": string,
      "degree": string,
      "fieldOfStudy": string,
      "startYear": number,
      "endYear": number
    }
  ],
  "projects": [
    {
      "name": string,
      "description": string,
      "technologies": string[],
      "role": string,
      "link": string,
      "startDate": string,
      "endDate": string
    }
  ],
  "availability": {
    "status": "Available" | "Open to Opportunities" | "Not Available",
    "type": "Full-time" | "Part-time" | "Contract",
    "startDate": string
  },
  "socialLinks": {
    "linkedin": string,
    "github": string,
    "portfolio": string
  }
}

Resume:
"""
${text}
"""
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const raw = response.text();

    const cleaned = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const match = cleaned.match(/\{[\s\S]*\}/);

    if (!match) {
        throw new Error("Gemini did not return valid JSON");
    }

    const parsed = JSON.parse(match[0]);

    return parsed;
};

export const generateScoreWithGemini = async (
    talentInfo:TalentProfileType,
    jobDescription: JobDescriptionInfoType
) => {
    const prompt = `
You are a talent evaluation AI.

Given the following talent profile and job description, generate a match score from 0 to 100 for each category and an overall score based on how well the talent fits the job.

IMPORTANT RULES:
- Return ONLY valid JSON
- NO markdown
- NO \`\`\`json
- NO explanations

Schema:
{
  "overallScore": number,
  "breakdown": {
    "skills": number,
    "experience": number,
    "education": number,
    "projects": number,
    "profileCompleteness": number
  },
  "summary": string
}

Talent Profile:
${JSON.stringify(talentInfo, null, 2)}

Job Description:
${JSON.stringify(jobDescription, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const raw = response.text();

    const cleaned = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const match = cleaned.match(/\{[\s\S]*\}/);

    if (!match) {
        throw new Error("Gemini did not return valid JSON");
    }

    const parsed = JSON.parse(match[0]);

    return parsed as TalentScore;
};