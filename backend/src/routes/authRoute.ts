import { Router } from "express";
import { loginHandler, registerHandler } from "../controllers/authController";
import { verifyToken } from "../utils/jwt";


const authRoutes = Router();


authRoutes.post("/register", registerHandler)
authRoutes.post("/login", loginHandler);

export default authRoutes;