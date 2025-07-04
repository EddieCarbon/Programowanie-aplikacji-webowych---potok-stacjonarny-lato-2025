// import { InferSchemaType, Schema, model, models } from "mongoose";
import mongoose, { InferSchemaType } from "mongoose";
import { WithId } from "./with-id";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please write your fullname"],
  },
  email: {
    type: String,
    required: [true, "please provide a valid email"],
    unique: true,
  },
  password: { type: String },
  role: {
    type: String,
    enum: ["admin", "devops", "developer", "guest"],
    default: "guest",
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export type UserType = InferSchemaType<typeof UserSchema>;
export type UserApi = WithId<UserType>;

export default User;
