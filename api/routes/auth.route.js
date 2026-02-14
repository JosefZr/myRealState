import express from "express";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middlewares/auth.js";
import User from "../models/User.js";
import { z } from "zod";
import sharp from "sharp";
import fss from 'fs/promises';
import { ApiError } from "../utils/ApiError.js";
import { login, logout, refresh, signup } from "../controllers/auth.controller.js";
const router = express.Router();
router.post("/register", signup);
router.post("/login", login)
router.post("/refresh", refresh);
router.post("/logout", authenticateToken, logout);
// router.post("/register", register);
// router.post("/login", login);
// router.post("/logout", logout);

export default router;
