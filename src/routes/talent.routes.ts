import express from "express";
import { generateData } from "../controllers/generateDataFromResume.controller";
import { uploadResumes } from "../services/multer.service";
import { generateScoreForAllTalents, generateScoreForOneTalent } from "../controllers/generateScore.controller";
import { deleteTheTalent, deleteTalentsByJobDescriptionController, getTalentInfo, getTalents, getTalentsByStatusController, updateTalentStatusController } from "../controllers/talentProfile.controller";
import { validateRequiredFields, validateBodyNotEmpty, validateEnum } from "../middleware/validation.middleware";

let TalentRouter = express.Router();

TalentRouter.post("/getData", uploadResumes, generateData);
TalentRouter.post('/generateScore', validateBodyNotEmpty, validateRequiredFields(["talentId", "jobDescriptionId"]), generateScoreForOneTalent);
TalentRouter.get('/getTalentInfo', validateRequiredFields(["talentId"]), getTalentInfo);
TalentRouter.get('/getTalents', getTalents);
TalentRouter.post('/generateScoreForAll', validateRequiredFields(["jobDescriptionId"]), generateScoreForAllTalents);
TalentRouter.delete('/deleteTalentsByJobDescription', validateRequiredFields(["jobDescriptionId"]), deleteTalentsByJobDescriptionController);
TalentRouter.delete('/deleteTalent', validateRequiredFields(["talentId"]), deleteTheTalent);
TalentRouter.get('/getTalentByStatus', getTalentsByStatusController);
TalentRouter.put('/updateTalentStatus', validateBodyNotEmpty, validateRequiredFields(["talentId", "status"]), validateEnum("status", ["Pending", "Screened", "Shortlisted", "Emailed", "Rejected"]), updateTalentStatusController);

export default TalentRouter;

/**
 * @openapi
 * /api/talent/getData:
 *   post:
 *     tags:
 *       - Talent
 *     summary: Upload and parse resumes
 *     description: Upload PDF, DOCX, or ZIP files containing resumes. AI parses them into structured talent profiles and saves them to MongoDB.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Resume files (PDF, DOCX, or ZIP)
 *     responses:
 *       200:
 *         description: Resumes successfully parsed and saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 saved:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       file:
 *                         type: string
 *                       profile:
 *                         $ref: '#/components/schemas/TalentProfile'
 *       400:
 *         description: No files uploaded or invalid format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error during file processing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/talent/generateScore:
 *   post:
 *     tags:
 *       - Talent
 *     summary: Generate score for one talent
 *     description: Score a single talent against a specific job description using AI evaluation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - talentId
 *               - jobDescriptionId
 *             properties:
 *               talentId:
 *                 type: string
 *                 description: MongoDB ObjectId of the talent
 *               jobDescriptionId:
 *                 type: string
 *                 description: MongoDB ObjectId of the job description
 *     responses:
 *       200:
 *         description: Talent scored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatedScore:
 *                   $ref: '#/components/schemas/TalentProfile'
 *       400:
 *         description: Validation error - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Talent or job description not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error during scoring
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/talent/getTalentInfo:
 *   get:
 *     tags:
 *       - Talent
 *     summary: Get talent information
 *     description: Retrieve a specific talent profile by ID
 *     parameters:
 *       - in: query
 *         name: talentId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the talent
 *     responses:
 *       200:
 *         description: Talent information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 talentInfos:
 *                   $ref: '#/components/schemas/TalentProfile'
 *       400:
 *         description: Validation error - talentId required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Talent not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/talent/getTalents:
 *   get:
 *     tags:
 *       - Talent
 *     summary: Get all talents ranked by score
 *     description: Retrieve all talent profiles sorted by overall score in descending order
 *     responses:
 *       200:
 *         description: Talents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 talents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TalentProfile'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/talent/generateScoreForAll:
 *   post:
 *     tags:
 *       - Talent
 *     summary: Generate scores for all talents
 *     description: Score all talents in the system against a specific job description
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobDescriptionId
 *             properties:
 *               jobDescriptionId:
 *                 type: string
 *                 description: MongoDB ObjectId of the job description
 *     responses:
 *       200:
 *         description: All talents scored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       talentId:
 *                         type: string
 *                       score:
 *                         $ref: '#/components/schemas/TalentScore'
 *       400:
 *         description: Validation error - jobDescriptionId required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/talent/getTalentByStatus:
 *   get:
 *     tags:
 *       - Talent
 *     summary: Get talents filtered by status
 *     description: Retrieve talents filtered by their current status (Pending, Screened, Shortlisted, Emailed, or Rejected)
 *     parameters:
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Pending, Screened, Shortlisted, Emailed, Rejected]
 *         description: Talent status to filter by
 *     responses:
 *       200:
 *         description: Talents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 talents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TalentProfile'
 *       400:
 *         description: Validation error - invalid status value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/talent/updateTalentStatus:
 *   put:
 *     tags:
 *       - Talent
 *     summary: Update talent status
 *     description: Update the status of a talent to reflect their stage in the screening process
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - talentId
 *               - status
 *             properties:
 *               talentId:
 *                 type: string
 *                 description: MongoDB ObjectId of the talent
 *               status:
 *                 type: string
 *                 enum: [Pending, Screened, Shortlisted, Emailed, Rejected]
 *                 description: New status for the talent
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 talent:
 *                   $ref: '#/components/schemas/TalentProfile'
 *       400:
 *         description: Validation error - invalid status or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Talent not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/talent/deleteTalent:
 *   delete:
 *     tags:
 *       - Talent
 *     summary: Delete a single talent
 *     description: Delete a specific talent profile from the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - talentId
 *             properties:
 *               talentId:
 *                 type: string
 *                 description: MongoDB ObjectId of the talent to delete
 *     responses:
 *       200:
 *         description: Talent deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error - talentId required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Talent not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/talent/deleteTalentsByJobDescription:
 *   delete:
 *     tags:
 *       - Talent
 *     summary: Delete all talents for a job description
 *     description: Delete all talents associated with a specific job description
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobDescriptionId
 *             properties:
 *               jobDescriptionId:
 *                 type: string
 *                 description: MongoDB ObjectId of the job description
 *     responses:
 *       200:
 *         description: Talents deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error - jobDescriptionId required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * components:
 *   schemas:
 *     Skill:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Node.js"
 *         level:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced, Expert]
 *           example: "Advanced"
 *         yearsOfExperience:
 *           type: number
 *           example: 5
 *
 *     Language:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "English"
 *         proficiency:
 *           type: string
 *           enum: [Basic, Conversational, Fluent, Native]
 *           example: "Fluent"
 *
 *     Certification:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "AWS Certified Developer"
 *         issuer:
 *           type: string
 *           example: "Amazon"
 *         issueDate:
 *           type: string
 *           format: date
 *           example: "2023-06-15"
 *
 *     Experience:
 *       type: object
 *       properties:
 *         company:
 *           type: string
 *           example: "Tech Corp"
 *         role:
 *           type: string
 *           example: "Backend Developer"
 *         startDate:
 *           type: string
 *           example: "2021-01"
 *         endDate:
 *           type: string
 *           example: "2024-03"
 *         description:
 *           type: string
 *           example: "Built and maintained REST APIs"
 *         technologies:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Node.js", "PostgreSQL", "Docker"]
 *         isCurrent:
 *           type: boolean
 *           example: false
 *
 *     Education:
 *       type: object
 *       properties:
 *         institution:
 *           type: string
 *           example: "University of Rwanda"
 *         degree:
 *           type: string
 *           example: "Bachelor's"
 *         fieldOfStudy:
 *           type: string
 *           example: "Computer Science"
 *         startYear:
 *           type: number
 *           example: 2017
 *         endYear:
 *           type: number
 *           example: 2021
 *
 *     Project:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Portfolio Website"
 *         description:
 *           type: string
 *           example: "Personal portfolio built with Next.js"
 *         technologies:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Next.js", "Tailwind CSS", "TypeScript"]
 *         role:
 *           type: string
 *           example: "Solo Developer"
 *         link:
 *           type: string
 *           example: "https://example.dev"
 *         startDate:
 *           type: string
 *           example: "2023-01"
 *         endDate:
 *           type: string
 *           example: "2023-06"
 *
 *     TalentScoreBreakdown:
 *       type: object
 *       properties:
 *         skills:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 85
 *         experience:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 78
 *         education:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 90
 *         projects:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 70
 *         profileCompleteness:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 95
 *
 *     TalentScore:
 *       type: object
 *       properties:
 *         overallScore:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 82
 *         breakdown:
 *           $ref: '#/components/schemas/TalentScoreBreakdown'
 *         summary:
 *           type: string
 *           example: "Strong candidate with relevant backend experience and proven project portfolio"
 *
 *     TalentProfile:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - location
 *       properties:
 *         _id:
 *           type: string
 *           example: "664f1a2b3c4d5e6f7a8b9c0d"
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         headline:
 *           type: string
 *           example: "Full Stack Developer with 5 years experience"
 *         bio:
 *           type: string
 *           example: "Experienced software engineer passionate about building scalable systems"
 *         location:
 *           type: string
 *           example: "Kigali, Rwanda"
 *         skills:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Skill'
 *         languages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Language'
 *         certifications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Certification'
 *         experience:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Experience'
 *         education:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Education'
 *         projects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Project'
 *         availability:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [Available, "Open to Opportunities", "Not Available"]
 *               example: "Open to Opportunities"
 *             type:
 *               type: string
 *               enum: [Full-time, Part-time, Contract]
 *               example: "Full-time"
 *             startDate:
 *               type: string
 *               format: date
 *               example: "2024-05-01"
 *         socialLinks:
 *           type: object
 *           properties:
 *             linkedin:
 *               type: string
 *               example: "https://linkedin.com/in/johndoe"
 *             github:
 *               type: string
 *               example: "https://github.com/johndoe"
 *             portfolio:
 *               type: string
 *               example: "https://johndoe.dev"
 *         talentScore:
 *           $ref: '#/components/schemas/TalentScore'
 *         status:
 *           type: string
 *           enum: [Pending, Screened, Shortlisted, Emailed, Rejected]
 *           example: "Shortlisted"
 *         jobDescription:
 *           type: string
 *           nullable: true
 *           example: "664f1a2b3c4d5e6f7a8b9c0e"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Validation Error"
 *         error:
 *           type: string
 *           example: "Missing required fields: talentId, status"
 *         missingFields:
 *           type: array
 *           items:
 *             type: string
 */
