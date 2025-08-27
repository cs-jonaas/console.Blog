import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";
import { de } from "zod/v4/locales/index.cjs";


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

userSchema.pre("save", async function (next) {
  // Skip hashing if the password is not modified 
  if(!this.isModified("password")) {
    return next();
  }
  // Hash password before saving
  this.password = await hashValue(this.password)
  next();
})

userSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password)
}

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;