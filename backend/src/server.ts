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
app.use((req, res, next) => {
  // Allow specific origins
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', APP_ORIGIN].filter(Boolean);
  
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight');
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// debug
app.use((req, res, next) => {
  console.log('=== CORS DEBUG ===');
  console.log('Request Origin:', req.headers.origin);
  console.log('Request Method:', req.method);
  console.log('Request Path:', req.path);
  next();
});


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


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