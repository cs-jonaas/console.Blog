import mongoose from "mongoose";


export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val:string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true, unique: true},
  // verified: {type: Boolean, required: true, default: false},
},
{
  timestamps: true,
})