import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { otpStore, generateOTP, sendOTPMail } from "../utils/otpHelper.js";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "supersecret", {
        expiresIn: "30d",
    });
};

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const [existingUsers] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        const userId = result.insertId;
        const token = generateToken(userId);

        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.status(201).json({
            id: userId,
            name,
            email,
            role: "user",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user.id);

        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const logoutUser = (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out" });
};

export const getMe = async (req, res) => {
    res.json(req.user);
};

export const updateProfile = async (req, res) => {
    const { name, email, password, currentPassword } = req.body;
    try {
        if (email && email !== req.user.email) {
            const [existing] = await pool.execute(
                "SELECT id FROM users WHERE email = ? AND id != ?",
                [email, req.user.id]
            );
            if (existing.length > 0) {
                return res.status(400).json({ message: "Email is already in use" });
            }
        }

        let query = "UPDATE users SET name = ?, email = ?";
        let params = [name || req.user.name, email || req.user.email];

        if (password) {
            if (!currentPassword) {
                return res.status(400).json({ message: "Current password is required to change password" });
            }

            const [userRow] = await pool.execute(
                "SELECT password FROM users WHERE id = ?",
                [req.user.id]
            );

            if (userRow.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            const isMatch = await bcrypt.compare(currentPassword, userRow[0].password);
            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect current password" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            query += ", password = ?";
            params.push(hashedPassword);
        }

        query += " WHERE id = ?";
        params.push(req.user.id);

        await pool.execute(query, params);

        res.json({
            message: "Profile updated successfully",
            user: {
                id: req.user.id,
                name: name || req.user.name,
                email: email || req.user.email,
                role: req.user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during profile update" });
    }
};

// @desc Generate & send OTP for registration
// @route POST /api/auth/register-otp
// @access Public
export const registerOTP = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const [existingUsers] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        otpStore.set(email, {
            name,
            email,
            password: hashedPassword,
            otp,
            expiresAt
        });

        await sendOTPMail(email, otp, "Registration");
        res.status(200).json({ message: "Verification OTP sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration OTP generation" });
    }
};

// @desc Verify OTP and complete registration
// @route POST /api/auth/verify-register
// @access Public
export const verifyRegister = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const record = otpStore.get(email);
        if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Insert new user
        const [result] = await pool.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [record.name, record.email, record.password]
        );

        otpStore.delete(email);

        const userId = result.insertId;
        const token = generateToken(userId);

        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            id: userId,
            name: record.name,
            email: record.email,
            role: "user",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration OTP verification" });
    }
};

// @desc Validate password & send OTP for login
// @route POST /api/auth/login-otp
// @access Public
export const loginOTP = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const otp = generateOTP();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        otpStore.set(email, {
            email,
            otp,
            expiresAt
        });

        await sendOTPMail(email, otp, "Login Log-in");
        res.status(200).json({ message: "Verification OTP sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login OTP generation" });
    }
};

// @desc Verify OTP and complete login
// @route POST /api/auth/verify-login
// @access Public
export const verifyLogin = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const record = otpStore.get(email);
        if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = rows[0];
        otpStore.delete(email);

        const token = generateToken(user.id);

        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login OTP verification" });
    }
};

