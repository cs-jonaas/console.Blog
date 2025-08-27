import jwt from "jsonwebtoken";
import SessionModel from "../models/sessionModel";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import UserModel from "../models/userModel";
import appAssert from "../utils/appAssert";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";

type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
}

export const createAccount = async (data: CreateAccountParams) => {
  //verify existing user doesnt exist
  const existingUser = await UserModel.exists({
    email: data.email,
  });
  appAssert(!existingUser, CONFLICT, "User already exists");
  // if (existingUser) {
  //   throw new Error("User already exists");
  // }
 
  //create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  })

  //create session for duration a user is logged in. refreshToken wiill refresh the accessToken for the session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent,
  })

  //sign access token and refresh token
  const refreshToken = jwt.sign(
    { 
      sessionId: session._id 
    },
    JWT_REFRESH_SECRET,
    {
      audience: ["user"],
      expiresIn: "30d",
    }
  );

  const accessToken = jwt.sign(
    {
      userId: user._id,
      sessionId: session._id,
    },
    JWT_SECRET,
    {
      audience: ["user"],
      expiresIn: "15m",
    }
  );

  //return user and token
  return {
    user,
    accessToken,
    refreshToken,
  }
};

type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
}

export const loginUser = async ({ email, password, userAgent }: LoginParams) => {
  // find user by email
  const user = await UserModel.findOne({ email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  // validate password from request
  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

  // create session
  const userId = user._id;

  const session = await SessionModel.create({
    userId,
    userAgent,
  });

  const sessionInfo = {
    sessionId: session._id,
  }
 
  // sign access token and refresh token
  const refreshToken = jwt.sign(
    sessionInfo,
    JWT_REFRESH_SECRET,
    {
      audience: ["user"],
      expiresIn: "30d",
    }
  );

  const accessToken = jwt.sign(
    {
      userId: user._id,
      ...sessionInfo,
    },
    JWT_SECRET,
    {
      audience: ["user"],
      expiresIn: "15m",
    }
  );

  
  // return user and tokens
  return {
    user,
    accessToken,
    refreshToken,
  }
}