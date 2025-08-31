import jwt from "jsonwebtoken";
import catchErrors from "../utils/catchErrors";
import { createAccount, loginUser } from "../services/authService";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import { setAuthCookies } from "../utils/cookies";
import { loginSchema, registerSchema } from "./authSchema";
import appAssert from "../utils/appAssert";
import UserModel from "../models/userModel";
import { JWT_SECRET } from "../constants/env";
import { verifyToken } from "../utils/jwt";

export const registerHandler = catchErrors (async (req, res) => {
  //Validate request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"] ?? "",
  })

  //call service
  const { user, accessToken, refreshToken } = await createAccount({
    ...request,
    userAgent: req.headers["user-agent"] ?? "",
  });

  if (req.body.password !== req.body.confirmPassword) {
    throw new Error("Passwords do not match");
  }
  
  //return response
  return setAuthCookies({res, accessToken, refreshToken})
   .status(CREATED)
   .json({
    message: "Register successful",
    // user: { id: user._id, email: user.email },
    accessToken,
   })
});

export const loginHandler = catchErrors(async (req, res) => {
  
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"] ?? "",
  });

  // Ensure userAgent is always a string
  const { user, accessToken, refreshToken } = await loginUser({
    ...request,
    userAgent: req.headers["user-agent"] ?? "",
  })

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .json({
      message: "Login successful",
      // user: { id: user._id, email: user.email },
      accessToken,
    })
});

export const meHandler = catchErrors(async (req, res) => {
  const token = req.cookies?.accessToken 
    || (req.headers.authorization?.split(" ")[1]);

  appAssert(token, UNAUTHORIZED, "No access token provided");

  // Verify and decode
  const decoded = verifyToken(token);

  // decoded contains: { userId, sessionId, iat, exp }
  const user = await UserModel.findById(decoded.userId).select("id email");

  appAssert(user, UNAUTHORIZED, "User not found");

  return res.json({
    user: { id: user._id, email: user.email },
  });
});