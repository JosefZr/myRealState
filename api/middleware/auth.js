import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader;
  if (!token)
    return res.status(401).json({ code: 401, message: "No token provided" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err)
      return res.status(403).json({ code: 403, message: "Invalid token" });

    const user = await User.findById(decoded.userId);
    console.log(decoded.userId, user);
    if (!user)
      return res.status(404).json({ code: 404, error: "User not found" });

    // Check if trial has expired
    // if (new Date() > user.trialEndDate && !user.isPaid && new Date() > user.subscriptionEndDate) {
    //   return res
    //     .status(403)
    //     .json({ code: 403, error: "Trial expired. Please make a payment." });
    // }

    console.log("=========================\n\n",user,token)

    req.user = user; // Attach user to request object
    next();
  });
};
