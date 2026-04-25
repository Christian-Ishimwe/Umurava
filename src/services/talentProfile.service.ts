import TalentProfile from "../database/models/talentProfile.model";
import { TalentScore } from "../types/talent.types";

export const saveTalentProfile = async (data: any) => {
    const profile = new TalentProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,

        headline: data.headline,
        bio: data.bio,
        location: data.location,

        skills: data.skills,
        languages: data.languages,
        certifications: data.certifications,
        experience: data.experience,
        education: data.education,
        projects: data.projects,

        availability: data.availability,
        socialLinks: data.socialLinks
    });

    return await profile.save();
};

export const getTalentInfos=async (id:string)=>{
    const talentInfo= await TalentProfile.findById(id)
    return talentInfo
}

export const saveScoreForTalent=async (talentId:string, score: TalentScore,jobDescriptionId:string)=>{
    return await TalentProfile.findByIdAndUpdate(
        talentId,
        { 
            talentScore: score, 
            jobDescription: jobDescriptionId  },
        { new: true }
    );
}


export const getRankedTalents = async () => {
    return await TalentProfile.find()
        .sort({ "talentScore.overallScore": -1 })
        .exec();
};

export const deleteTalent=async (talentId:string)=>{
    const deletedTalent= await TalentProfile.findByIdAndDelete(talentId)
    return deletedTalent
}

export const deleteTalentsByJobDescription = async (jobDescriptionId: string) => {
    return await TalentProfile.deleteMany({ jobDescription: jobDescriptionId });
};

export const getTalentsByStatus = async (
  status: "Pending" | "Screened" | "Shortlisted" | "Emailed" | "Rejected"
) => {
  return await TalentProfile.find({ status });
};

export const updateTalentStatus = async (
  id: string,
  status: "Pending" | "Screened" | "Shortlisted" | "Emailed" | "Rejected"
) => {
  return await TalentProfile.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
};