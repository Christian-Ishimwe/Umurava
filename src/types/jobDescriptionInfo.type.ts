export interface RequiredSkill {
  name: string;
  minLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  yearsRequired?: number;
}

export interface SalaryRange {
  min?: number;
  max?: number;
  currency?: string;
}

export interface JobDescriptionInfoType {
  jobTitle: string;
  department: string;
  description: string;
  requiredSkills?: RequiredSkill[];
  experienceLevel?: "Entry-level" | "Mid-level" | "Senior" | "Lead";
  yearsOfExperienceRequired?: number;
  salaryRange?: SalaryRange;
  employmentType?: "Full-time" | "Part-time" | "Contract" | "Temporary";
  location?: string;
  isRemote?: boolean;
  responsibilities?: string[];
  benefits?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}