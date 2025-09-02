import { z } from "zod"; //Using zod for schema validation

  const usernameSchema = z.string().min(3, { message: "Username must be at least 3 characters" }).max(30, { message: "Username must be at most 30 characters" }).trim();
  const emailSchema = z.string().email().min(1).max(255).trim();
  const passwordSchema = z.string().min(8).max(255).trim();


export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    userAgent: z.string().optional(),
  })


export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(8).max(255),
  userAgent: z.string().optional(),
  
}).refine(      //Verify that password and confirmPassword match
  (data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
