import mongoose from "mongoose";

export interface User extends mongoose.Document {
  name: string;
  email: string;
  grantId: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
}

const UserSchema = new mongoose.Schema<User>({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  grantId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model is already compiled and use it, otherwise define it
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;

