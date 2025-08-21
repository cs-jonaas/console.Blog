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

app.use("/auth", authRoutes);

app.use(errorHandler);

//Listen to the database
app.listen(PORT, async() => {
  console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`);
  await connectToDatabse();
});