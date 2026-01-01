// blog-backend/controllers/authController.js - WITH AVATAR UPLOAD
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import ApiResponse from '../utils/apiResponse.js';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, bio } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return ApiResponse.error(res, 400, 'Please provide all required fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return ApiResponse.error(res, 400, 'User already exists');
    }

    // Handle avatar upload if provided
    let avatarUrl = '';
    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "avatars"
      );
      avatarUrl = uploadResult.url;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      bio: bio || '',
      avatar: avatarUrl,
    });

    if (user) {
      const token = generateToken(user._id);

      return ApiResponse.success(res, 201, 'User registered successfully', {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        token,
      });
    } else {
      return ApiResponse.error(res, 400, 'Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return ApiResponse.error(res, 400, 'Please provide email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      return ApiResponse.success(res, 200, 'Login successful', {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        token,
      });
    } else {
      return ApiResponse.error(res, 401, 'Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    return ApiResponse.success(res, 200, 'User profile retrieved', {
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

      // Handle avatar upload if new file provided
      if (req.file) {
        // Delete old avatar if it exists and is not a URL
        if (user.avatar && !user.avatar.startsWith('http')) {
          try {
            const oldPublicId = user.avatar
              .split("/")
              .slice(-2)
              .join("/")
              .split(".")[0];
            await deleteFromCloudinary(oldPublicId);
          } catch (err) {
            // Ignore deletion errors
          }
        }

        // Upload new avatar
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "avatars"
        );
        user.avatar = uploadResult.url;
      }

      // Only update password if provided
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      return ApiResponse.success(res, 200, 'Profile updated successfully', {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
      });
    } else {
      return ApiResponse.error(res, 404, 'User not found');
    }
  } catch (error) {
    next(error);
  }
};