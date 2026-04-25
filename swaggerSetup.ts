import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { Application, Request, Response } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Umurava AI - Talent Screening Engine",
      version: "1.0.0",
      description: "Backend API for AI-powered talent screening and ranking using Google Gemini",
      contact: {
        name: "Umurava AI",
        url: "https://github.com/vegetason/Umurava"
      },
      license: {
        name: "MIT"
      }
    },
    servers: [
      {
        url: "http://localhost:3004",
        description: "Local development server"
      },
      {
        url: "https://api.umurava.com",
        description: "Production server"
      }
    ],
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            statusCode: { type: "number", example: 400 },
            message: { type: "string", example: "Error message" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, "../src/routes/*.ts"),
    path.join(process.cwd(), "src/routes/*.ts"),
  ]
};

const swaggerSpec = swaggerJSDoc(options);

console.log("Swagger spec generated with paths:", Object.keys((swaggerSpec as any).paths || {}).length, "endpoints");

export const setupSwagger = (app: Application): void => {
  const swaggerUi = require("swagger-ui-express");

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      url: "/docs-json",
      presets: [swaggerUi.presets.apis, swaggerUi.SwaggerUIBundle.presets.configuration],
      persistAuthorization: true
    },
    customCss: `.swagger-ui .topbar { display: none }`
  }));

  app.get("/docs-json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};