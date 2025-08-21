import mongoose from 'mongoose';
import { MONGO_URI } from '../constants/env';

//Connect to MongoDB using Mongoose
//exported to server.ts
const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit connection if failed
  }
};

export default connectToDatabase;