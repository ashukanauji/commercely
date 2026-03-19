import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  role: user.role,
  createdAt: user.createdAt,
});

const createToken = (user) =>
  JWT.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    if (!name || !email || !password || !phone || !address || !answer) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedAnswer = answer.toLowerCase().trim();

    const existingUser = await userModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already exists, please login",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await userModel.create({
      name,
      email: normalizedEmail,
      phone,
      address,
      password: hashedPassword,
      answer: normalizedAnswer,
    });

    return res.status(201).send({
      success: true,
      message: "User registered successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found, please register",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = createToken(user);

    return res.status(200).send({
      success: true,
      message: "Login successful",
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email || !answer || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Email, answer, and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).send({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await userModel.findOne({
      email: email.toLowerCase().trim(),
      answer: answer.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found or answer is incorrect",
      });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in forgot password",
      error: error.message,
    });
  }
};

export const getProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password -answer");
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, phone, address, password } = req.body;
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    if (password) {
      user.password = await hashPassword(password);
    }

    await user.save();

    return res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

export const getUsersController = async (_req, res) => {
  try {
    const [users, totalOrders] = await Promise.all([
      userModel.find({}).select("-password -answer").sort({ createdAt: -1 }),
      orderModel.aggregate([
        { $group: { _id: "$user", orders: { $sum: 1 }, spent: { $sum: "$total" } } },
      ]),
    ]);

    const orderMap = new Map(totalOrders.map((entry) => [String(entry._id), entry]));
    const enrichedUsers = users.map((user) => ({
      ...user.toObject(),
      metrics: {
        orders: orderMap.get(String(user._id))?.orders || 0,
        spent: orderMap.get(String(user._id))?.spent || 0,
      },
    }));

    return res.status(200).send({
      success: true,
      users: enrichedUsers,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const updateUserRoleController = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (![0, 1].includes(role)) {
      return res.status(400).send({
        success: false,
        message: "Role must be 0 or 1",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password -answer");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to update user role",
      error: error.message,
    });
  }
};

export const testController = (_req, res) => {
  res.send("Protected route accessed successfully");
};
