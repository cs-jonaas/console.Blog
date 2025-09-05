import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import SessionModel from "../models/sessionModel";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import UserModel, { UserDocument } from "../models/userModel";
import appAssert from "../utils/appAssert";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import { refreshTokenSignOptions, signToken } from "../utils/jwt";

type CreateAccountParams = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
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
    username: data.username,
    password: data.password,
    confirmPassword: data.confirmPassword,
  }) as InstanceType<typeof UserModel>;

  const userId =  user._id;

  //create session for duration a user is logged in. refreshToken wiill refresh the accessToken for the session
  const session = await SessionModel.create({
    userId,
    userAgent: data.userAgent,
  })

  const sessionInfo = {
    sessionId: session._id,
  }

  //sign access token and refresh token
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const accessToken = signToken({
    ...sessionInfo,
    userId: user._id,
  });

  const typedUser = user as UserDocument
  //return user and token
  return {
    user: {
      id: typedUser._id.toString(),
      username: typedUser.username,
      email: typedUser.email,
    },
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
      userId,
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