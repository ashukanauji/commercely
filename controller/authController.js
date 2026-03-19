import userModel from "../models/userModel.js";
import { hashPassword, comparePassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

//Register Controller || Post Method
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //Validate request data
    if (!name || !email || !password || !phone || !address || !answer) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    //check if user already exists
    const existingUser = await userModel.findOne({ email });

    //if user exists, throw error
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User already exists, please login",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);
    //save user to database
    const user = await userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Error in registerController:", error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

// POST Method || LOGIN CONTROLLER

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request data
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found, please register",
      });
    }

    // Validate password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
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
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error in loginController:", error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

// Forgot Password Controller
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    // Validate request data
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    // Check if user exists
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found or answer is incorrect",
      });
    }
    // Hash new password
    // const hashed = await hashPassword(newPassword);
    // await userModel.findById(user._id, { password: hashed });

    // Hash and update password
    const hashed = await hashPassword(newPassword);
    user.password = hashed;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error in forgotPasswordController:", error);
    res.status(500).send({
      success: false,
      message: "Error in forgot password",
      error: error.message,
    });
  }
};

// Test Controller
export const testController = (req, res) => {
  console.log("Protected route accessed");
  res.send("Protected route accessed successfully");
};
