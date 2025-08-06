import userModel from "../models/userModel.js";
import { hashPassword, comparePassword } from "../helper/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, question } = req.body;
    // validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone number is required" });
    }
    if (!address) {
      return res.send({ message: "Address is required" });
    }
    if (!question) {
      return res.send({ message: "Security answer is required" });
    }
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already registered, please login",
      });
    }

    // Hash password (make sure hashPassword throws on error)
    const hashedPassword = await hashPassword(password);

    // Save new user
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      question,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate key error (code 11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).send({
        success: false,
        message: `Duplicate value for ${field}: ${error.keyValue[field]}`,
      });
    }

    res.status(500).send({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};
// POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    // check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    // compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(409).send({
        success: false,
        message: "Invalid password",
      });
    }
    // create token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token, // send token
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// Forgot Password Controller
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, question, newPassword } = req.body;
    // validation
    if (!email || !question || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }
    // check user
    const user = await userModel.findOne({ email, question });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found or invalid credentials",
      });
    }
    // hash new password
    const hashedPassword = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { new: true } // return the updated user
    );
    res.status(200).send({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).send({
      success: false,
      message: "Error in resetting password",
      error: error.message,
    });
  }
};

// Test Controller
export const testController = (req, res) => {
  res.send("Protected route");
};
