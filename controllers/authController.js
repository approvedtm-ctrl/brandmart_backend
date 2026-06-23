import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

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

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
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

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
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
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out" });
};

export const getMe = async (req, res) => {
    res.json(req.user);
};
