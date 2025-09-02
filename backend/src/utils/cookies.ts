import { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";

const secure = process.env.NODE_ENV !== "development";

// const defaults: CookieOptions = {
//   sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict",
//   httpOnly: true,
//   secure: process.env.NODE_ENV !== "development", // false in dev, true in prod
// }

const defaults: CookieOptions = {
  sameSite: "lax",
  httpOnly: true,
  secure: false,
}

const getAccessTokenCookieOptions = (): CookieOptions => ({
  sameSite: "lax",
  httpOnly: true,
  secure: false,
  domain: "localhost",
  expires: fifteenMinutesFromNow(),
})

//Only refreshes on the auth route
// const getRefreshTokenCookieOptions = (): CookieOptions => ({
//   ...defaults,
//   expires: thirtyDaysFromNow(),
//   path: "/auth/refresh",
// })
const getRefreshTokenCookieOptions = (): CookieOptions => ({
  sameSite: "lax",
  httpOnly: true,
  secure: false,
  domain: "localhost",
  expires: thirtyDaysFromNow(),
  path: "/auth/refresh",
})

type Params = {
  res: Response,
  accessToken: string;
  refreshToken: string;
}

export const setAuthCookies = ({res, accessToken, refreshToken}: Params ) => 

  
  res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());