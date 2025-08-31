import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { SessionDocument } from "../models/sessionModel";
import { UserDocument } from "../models/userModel";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import appAssert from "./appAssert";
import { UNAUTHORIZED } from "../constants/http";

export type RefreshTokenPayload = {
  sessionId: SessionDocument["_id"];
};

export type AccessTokenPayload = {
  userId: UserDocument["_id"];
  sessionId: SessionDocument["_id"];
}

// SignOptions has the JWT sign options but does not include secret
type SignOptionsAndSecret = SignOptions & {
  secret?: string;
}

const defaults: SignOptions = {
  audience: "user",
}

const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "15m",
  secret: JWT_SECRET
}

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "15m",
  secret: JWT_REFRESH_SECRET
}

export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret
) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;  // If the curly bracket is an empty object, secret will return undefined. 
  if (!secret) {
    throw new Error("JWT secret must be provided");
  }
  return jwt.sign(payload, secret, {
    ...defaults,
    ...signOpts});
};

export const verifyToken = <Payload = jwt.JwtPayload>(
  token: string,
  options?: jwt.VerifyOptions
): Payload => {
  try {
    // secret to use based on the expected audience
    const secret = options?.audience ? JWT_SECRET : JWT_REFRESH_SECRET;
    
    const decoded = jwt.verify(token, secret, options);
    return decoded as Payload;
  } catch (err) {
    // throw an unauthorized error if fails
    appAssert(false, UNAUTHORIZED, 'Invalid or expired token');
  }
};