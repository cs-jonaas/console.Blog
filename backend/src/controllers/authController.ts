import { z } from "zod";
import catchErrors from "../utils/catchErrors";

//Using zod for schema validation
const registerSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(8).max(255),
  confirmPassword: z.string().min(8).max(255),
  userAgent: z.string().optional(),
}).refine(
  (data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const registerHandler = catchErrors (async (req, res) => {
  //Validate request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  })
res.status(200).json({
    message: "Registration successful!",
    data: {
      email: request.email,
      // Don't include passwords in the response
      userAgent: request.userAgent
    }
  });
  //call service
  //return response
});
