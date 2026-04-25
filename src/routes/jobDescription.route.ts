import express from "express";
import { createJobDescriptionInfo } from "../controllers/createJobDescription.controller";
import {
    deleteJobDescriptionController,
    getJobDescriptionController,
    getJobDescriptionsController,
    updateJobDescriptionController
} from "../controllers/jobDescription.controller";
import { validateRequiredFields, validateBodyNotEmpty } from "../middleware/validation.middleware";

let JobDescriptionRouter = express.Router();

JobDescriptionRouter.post("/createJobDescription", 
    validateBodyNotEmpty,
    validateRequiredFields(["jobTitle", "department", "description"]),
    createJobDescriptionInfo);
JobDescriptionRouter.get("/", getJobDescriptionsController);
JobDescriptionRouter.get("/getOne", 
    validateRequiredFields(["jobDescriptionId"]),
    getJobDescriptionController);
JobDescriptionRouter.put("/update", 
    validateBodyNotEmpty,
    validateRequiredFields(["jobDescriptionId"]),
    updateJobDescriptionController);
JobDescriptionRouter.delete("/delete", 
    validateRequiredFields(["id"]),
    deleteJobDescriptionController);

export default JobDescriptionRouter;

/**
 * @openapi
 * /api/jobDescription/createJobDescription:
 *   post:
 *     tags:
 *       - Job Description
 *     summary: Create a new job description
 *     description: Create a job description with skills, experience level, and compensation details for AI matching
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobTitle
 *               - department
 *               - description
 *             properties:
 *               jobTitle:
 *                 type: string
 *                 example: "Senior Backend Developer"
 *               department:
 *                 type: string
 *                 example: "Engineering"
 *               description:
 *                 type: string
 *                 example: "We are looking for an experienced backend developer..."
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Node.js"
 *                     minLevel:
 *                       type: string
 *                       enum: [Beginner, Intermediate, Advanced, Expert]
 *                       example: "Advanced"
 *                     yearsRequired:
 *                       type: number
 *                       example: 3
 *               experienceLevel:
 *                 type: string
 *                 enum: [Entry-level, Mid-level, Senior, Lead]
 *                 example: "Senior"
 *               yearsOfExperienceRequired:
 *                 type: number
 *                 example: 5
 *               salaryRange:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                     example: 80000
 *                   max:
 *                     type: number
 *                     example: 120000
 *                   currency:
 *                     type: string
 *                     example: "USD"
 *               employmentType:
 *                 type: string
 *                 enum: [Full-time, Part-time, Contract, Temporary]
 *                 example: "Full-time"
 *               location:
 *                 type: string
 *                 example: "Remote"
 *               isRemote:
 *                 type: boolean
 *                 example: true
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Design and build REST APIs", "Lead architecture decisions", "Mentor junior developers"]
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Health Insurance", "Stock Options", "Professional Development"]
 *     responses:
 *       201:
 *         description: Job description created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 created:
 *                   $ref: '#/components/schemas/JobDescription'
 *       400:
 *         description: Validation error - missing required fields
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
 * /api/jobDescription/:
 *   get:
 *     tags:
 *       - Job Description
 *     summary: Get all job descriptions
 *     description: Retrieve all job descriptions in the system
 *     responses:
 *       200:
 *         description: Job descriptions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobDescriptions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobDescription'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/jobDescription/getOne:
 *   get:
 *     tags:
 *       - Job Description
 *     summary: Get a specific job description
 *     description: Retrieve a specific job description by ID
 *     parameters:
 *       - in: query
 *         name: jobDescriptionId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the job description
 *     responses:
 *       200:
 *         description: Job description retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobDescription:
 *                   $ref: '#/components/schemas/JobDescription'
 *       400:
 *         description: Validation error - jobDescriptionId required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job description not found
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
 * /api/jobDescription/update:
 *   put:
 *     tags:
 *       - Job Description
 *     summary: Update a job description
 *     description: Update an existing job description with new details
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
 *                 description: MongoDB ObjectId of the job description to update
 *               jobTitle:
 *                 type: string
 *               department:
 *                 type: string
 *               description:
 *                 type: string
 *               experienceLevel:
 *                 type: string
 *                 enum: [Entry-level, Mid-level, Senior, Lead]
 *               yearsOfExperienceRequired:
 *                 type: number
 *               salaryRange:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *                   currency:
 *                     type: string
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Job description updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updated:
 *                   $ref: '#/components/schemas/JobDescription'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job description not found
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
 * /api/jobDescription/delete:
 *   delete:
 *     tags:
 *       - Job Description
 *     summary: Delete a job description
 *     description: Delete a job description and all associated talent scores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: MongoDB ObjectId of the job description to delete
 *     responses:
 *       200:
 *         description: Job description deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job description deleted successfully"
 *       400:
 *         description: Validation error - id required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job description not found
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
 *     RequiredSkill:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Node.js"
 *         minLevel:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced, Expert]
 *           example: "Advanced"
 *         yearsRequired:
 *           type: number
 *           example: 3
 *
 *     SalaryRange:
 *       type: object
 *       properties:
 *         min:
 *           type: number
 *           example: 80000
 *         max:
 *           type: number
 *           example: 120000
 *         currency:
 *           type: string
 *           example: "USD"
 *
 *     JobDescription:
 *       type: object
 *       required:
 *         - jobTitle
 *         - department
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           example: "664f1a2b3c4d5e6f7a8b9c0e"
 *         jobTitle:
 *           type: string
 *           example: "Senior Backend Developer"
 *         department:
 *           type: string
 *           example: "Engineering"
 *         description:
 *           type: string
 *           example: "We are looking for an experienced backend developer to join our team..."
 *         requiredSkills:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RequiredSkill'
 *         experienceLevel:
 *           type: string
 *           enum: [Entry-level, Mid-level, Senior, Lead]
 *           example: "Senior"
 *         yearsOfExperienceRequired:
 *           type: number
 *           example: 5
 *         salaryRange:
 *           $ref: '#/components/schemas/SalaryRange'
 *         employmentType:
 *           type: string
 *           enum: [Full-time, Part-time, Contract, Temporary]
 *           example: "Full-time"
 *         location:
 *           type: string
 *           example: "Kigali, Rwanda"
 *         isRemote:
 *           type: boolean
 *           example: true
 *         responsibilities:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Design REST APIs", "Lead architecture decisions", "Mentor junior developers"]
 *         benefits:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Health Insurance", "Stock Options", "Professional Development"]
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
 *           example: "Missing required fields: jobDescriptionId"
 *         missingFields:
 *           type: array
 *           items:
 *             type: string
 */
