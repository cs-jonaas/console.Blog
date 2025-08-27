import mongoose from "mongoose";
import { oneWeekFromNow, thirtyDaysFromNow } from "../utils/date";

// SessionDocument interface from mongoose.Document
export interface SessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

// SessionSchema to set for logged in user with expiry
const sessionSchema = new mongoose.Schema<SessionDocument> ({
  userId: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
    inde: true,
  },
  userAgent: { type: String },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true, default: thirtyDaysFromNow },
})

//Export to authService.ts
const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;