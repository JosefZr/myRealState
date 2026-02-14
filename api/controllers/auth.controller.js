import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate Access Token (short-lived)
export const generateAccessToken = (user) => {
    let accessExp = "1d"; // Default to free trial expiration
  return jwt.sign(
    { 
      userId: user._id, 
      role: user.role, 
      firstName:user.firstName, 
      lastName:user.lastName, 
      email:user.email, 
      phoneNumber:user.phoneNumber,
      region:user.region, 
      token:user.notificationTokens, 
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: accessExp }
  );
};
// Generate Refresh Token (long-lived)
export const generateRefreshToken = (user) => {
  let refreshExp = "30d"; // Default refresh token expiration
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: refreshExp }
  );
};
export const signup = async (req, res) => {
  try {
    const { userData } = req.body;
    console.log("Received signup data:", userData);
    if (!userData) {
      return res.status(400).json({ error: "Invalid Request" });
    }
    const user = await User.create({
      ...userData,
      role: "client",

    });

    return res.status(201).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
      },
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "An unexpected error occurred",
      error: error.message,
      errorDetails: error.errors ? Object.keys(error.errors) : "No specific error details",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Vérifier si c'est un email ou un téléphone
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPhone = /^(\+213|0)(5|6|7)\d{8}$/.test(email);
    
    let user;
    if (isEmail) {
      user = await User.findOne({ email });
    } else if (isPhone) {
      let normalizedPhone = email;

      // Si commence par 0 → remplace par +213
      if (/^0/.test(normalizedPhone)) {
        normalizedPhone = "+213" + normalizedPhone.slice(1);
      }

      // Si commence déjà par +213 → garde tel quel
      if (/^\+213/.test(normalizedPhone)) {
        normalizedPhone = normalizedPhone;
      }
      user = await User.findOne({ phoneNumber: normalizedPhone });
    } else {
      return res.status(400).json({ 
        success: false,
        error: "Invalid email or phone format" 
      });
    }

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid credentials" 
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({ 
        success: false,
        error: "Account is banned" 
      });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid credentials" 
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    // Send response with proper structure
    res.status(200).json({ 
      success: true,
      token: accessToken,
      refreshToken: refreshToken,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar
      }
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};
export const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(401);

  const user = await User.findOne({ refreshToken });
  if (!user) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  });
};
export const logout = async (req, res) => {
  try {
    // Get user from authentication middleware
    const user = req.user;
    
    // Clear refresh token from database
    await User.findByIdAndUpdate(user._id, { refreshToken: null });

    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};