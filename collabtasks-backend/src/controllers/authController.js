import User from "../models/User.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

// Helper to sign JWT
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const signRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

// REGISTER
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    const token = signToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    res.status(201).json({ status: "success", token, refreshToken, data: { user } });
  } catch (err) {
    next(err);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email & password exist
    if (!email || !password) return next(new AppError("Please provide email and password", 400));

    // 2) Find user and check password
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // 3) Send tokens
    const token = signToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    res.status(200).json({ status: "success", token, refreshToken });
  } catch (err) {
    next(err);
  }
};

// PROTECT middleware
export const protect = async (req, res, next) => {
  try {
    let token;
    // 1) Check for token in headers
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return next(new AppError("You are not logged in!", 401));

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next(new AppError("User no longer exists", 401));

    // 4) Attach user to request
    req.user = currentUser;
    next();
  } catch (err) {
    next(new AppError("Invalid or expired token", 401));
  }
};

// RESTRICT TO roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("You do not have permission to perform this action", 403));
    next();
  };
};

// REFRESH TOKEN endpoint
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(new AppError("Refresh token missing", 400));

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError("User not found", 401));

    const newToken = signToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);

    res.status(200).json({ status: "success", token: newToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(new AppError("Invalid refresh token", 401));
  }
};
