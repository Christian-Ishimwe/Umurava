import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import createError from "http-errors";
import router from "./src/routes/routes";
import { setupSwagger } from "./swaggerSetup";
import { errorHandler, notFoundHandler } from "./src/middleware/errorHandler.middleware";

const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

setupSwagger(app);
app.use('/api', router);

// Not found handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;