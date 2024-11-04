import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  username?: string; 
  createdAt?: Date; 
  updatedAt?: Date; 
}

const userSchema: Schema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true, 
      sparse: true,  
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
