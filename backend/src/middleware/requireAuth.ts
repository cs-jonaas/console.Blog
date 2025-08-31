import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt'; 
import appAssert from '../utils/appAssert';
import { UNAUTHORIZED } from '../constants/http';

// Extend the Express Request interface to include our custom userId property
export interface AuthenticatedRequest extends Request {
  userId?: string;
}

const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token from the cookies
    const accessToken = req.cookies.accessToken;
    appAssert(accessToken, UNAUTHORIZED, 'Access token is required');

    // Verify the token
    const decoded = verifyToken(accessToken, { audience: ['user'] });

    // Attach the userId to the request object
    req.userId = decoded.userId;

    // Proceed to the next middleware
    next();
  } catch (error) {
    next(error); // Pass any errors (like invalid token) to the global error handler
  }
};

export default requireAuth;