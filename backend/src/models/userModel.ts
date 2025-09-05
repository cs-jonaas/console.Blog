// models/userModel.ts
import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  savedPosts: mongoose.Types.ObjectId[];
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    username: { 
      type: String, 
      required: true 
    },
    savedPosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await hashValue(this.password);
  next();
});

userSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;

// import mongoose from "mongoose";
// import { compareValue, hashValue } from "../utils/bcrypt";


// export interface UserDocument extends mongoose.Document {
//   _id: mongoose.Types.ObjectId;
//   username: string;
//   email: string;
//   password: string;
//   savedPosts: mongoose.Types.ObjectId[];
//   userAgent?: string;
//   createdAt: Date;
//   updatedAt: Date;
//   comparePassword(val:string): Promise<boolean>;
// }

// const userSchema = new mongoose.Schema<UserDocument>({
//   email: {type: String, required: true, unique: true},
//   password: {type: String, required: true},
//   username: { type: String, required: true},
//   savedPosts: [{
//     type: mongoose,
//     ref: "Post",
//   }]
//   // verified: {type: Boolean, required: true, default: false},
// },
// {
//   timestamps: true,
// })

// userSchema.pre("save", async function (next) {
//   // Skip hashing if the password is not modified 
//   if(!this.isModified("password")) {
//     return next();
//   }
//   // Hash password before saving
//   this.password = await hashValue(this.password)
//   next();
// })

// userSchema.methods.comparePassword = async function (val: string) {
//   return compareValue(val, this.password)
// }

// const UserModel = mongoose.model<UserDocument>("User", userSchema);

// export default UserModel;