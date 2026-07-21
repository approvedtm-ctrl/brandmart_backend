import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    updateProfile,
    registerOTP,
    verifyRegister,
    loginOTP,
    verifyLogin
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/register-otp", registerOTP);
router.post("/verify-register", verifyRegister);
router.post("/login-otp", loginOTP);
router.post("/verify-login", verifyLogin);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

export default router;
