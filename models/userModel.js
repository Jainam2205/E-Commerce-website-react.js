import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes whitespace from both ends of the string
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0, // Default role is 'user'
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);
export default mongoose.model("users", userSchema);
