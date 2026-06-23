import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");

        const [rows] = await pool.execute(
            "SELECT id, name, email, role FROM users WHERE id = ?",
            [decoded.id]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        req.user = rows[0];
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as an admin" });
    }
};
