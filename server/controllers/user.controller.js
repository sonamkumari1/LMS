import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import {deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

// User Registration
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are mandatory",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    // Check password
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    // Generate token and set in cookies
    generateToken(res, user);

    // Send the final response
    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.name}`,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

export const logout = (req, res) => {
  try {
    // Corrected `status` method
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get user profile",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id; // Assuming `req.id` contains the authenticated user's ID
    const { name } = req.body;
    const profilePic = req.file; // Assuming `profilePic` is uploaded using a middleware like `multer`

    if (!profilePic) {
      return res.status(400).json({
        success: false,
        message: "Profile picture is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If an old photo URL exists, delete it from Cloudinary
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0]; // Extract public ID
      await deleteMediaFromCloudinary(publicId); // Ensure this function is properly defined
    }

    // Upload the new profile picture to Cloudinary
    const cloudResponse = await uploadMedia(profilePic.path); // Ensure `uploadMedia` uploads correctly
    const photoUrl = cloudResponse.secure_url;

    // Prepare and update user data
    const updatedData = {
      name: name || user.name, // Retain the current name if none provided
      photoUrl,
    };
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password"); // Exclude password field from the response

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,

    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
