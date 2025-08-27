// Assert a condition and throws an AppError if condition is falsy
import assert from "node:assert";
import AppError from "./AppError";
import { HttpStatusCode } from "../constants/http";
import AppErrorCode from "../constants/appErrorCode";


type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

const appAssert: AppAssert = (
  condition,
  httpstatuscode,
  message,
  appErrorCode,
) => assert(condition, new AppError(httpstatuscode, message, appErrorCode));


export default appAssert;