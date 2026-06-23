import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "brandmart",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const seedAdmin = async () => {
    const name = "System Administrator";
    const email = "admin@brandmart.com";
    const password = "adminpassword123"; // User should change this after first login

    try {
        const [existing] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            console.log("Admin user already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, "admin"]
        );

        console.log("Admin user seeded successfully!");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
