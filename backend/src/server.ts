import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import connectToDatabse from './config/db';
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import { OK } from './constants/http';
import authRoutes from './routes/authRoute';
import postRoutes from './routes/postRoute';
import requireAuth, { AuthenticatedRequest } from './middleware/requireAuth';
import UserModel from './models/userModel';

const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: APP_ORIGIN,
  credentials: true
}));
app.use(cookieParser());


app.get('/', 
  (req, res, next) => {
      res.status(OK).json({
        status: 'Connecting to console.Blog!'
      });
  });

  app.get('/api/auth/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  // requireAuth already set req.userId
  const user = await UserModel.findById(req.userId).select('email');
  res.json(user);
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

app.use(errorHandler);

//Listen to the database
app.listen(PORT, async() => {
  console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`);
  await connectToDatabse();
});