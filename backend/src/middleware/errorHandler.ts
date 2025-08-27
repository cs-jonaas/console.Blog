import { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import z from "zod";
import catchErrors from "../utils/catchErrors";
import AppError from "../utils/AppError";

// Handle Zod validation errors
// This function will format the Zod error into a more readable format and return a JSON response
const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((error) => ({
    path: error.path.join("."),
    message: error.message,
}));
  return res.status(BAD_REQUEST).json({
    message: error.message,
    errors,
  })
}

const handleAppError = (res: Response, error: AppError) => {
  return res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  })
}

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(`PATH: ${req.path}`, error);

  //Check if error is a validation error
  if (error instanceof z.ZodError) {
    return handleZodError(res, error);
  }

  if(error instanceof AppError) {
    return handleAppError(res, error);
  }

  return res.status(INTERNAL_SERVER_ERROR).json("INTERNAL SERVER ERROR")
}

export default errorHandler;
