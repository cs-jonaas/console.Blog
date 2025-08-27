import catchErrors from "../utils/catchErrors";
import { createAccount, loginUser } from "../services/authService";
import { CREATED, OK } from "../constants/http";
import { setAuthCookies } from "../utils/cookies";
import { loginSchema, registerSchema } from "./authSchema";


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
  
  //return response
  return setAuthCookies({res, accessToken, refreshToken})
   .status(CREATED)
   .json(user)
});

export const loginHandler = catchErrors(async (req, res) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"] ?? "",
  });

  // Ensure userAgent is always a string
  const { accessToken, refreshToken } = await loginUser({
    ...request,
    userAgent: req.headers["user-agent"] ?? "",
  })

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .json
    
  ({
    message: "Login successful"
  })
});