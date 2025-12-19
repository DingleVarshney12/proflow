import mongoose from "mongoose";
interface User {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "Client" | "Freelancer";
  createdAt: Date;
}
const userSchema = new mongoose.Schema<User>(
  {
    name: { type: String, required: [true, "Provide your name"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        "Please provide a valid email address!",
      ],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be 6 characters"],
    },
    role: { type: String, enum: ["Client", "Freelancer"], required: true },
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
