import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "brandmart",
    waitForConnections: true,
    connectionLimit: 10,
});

// Test connection and log success
pool.getConnection()
    .then((connection) => {
        console.log("✅ MySQL database connected successfully.");
        connection.release();
    })
    .catch((err) => {
        console.error("❌ MySQL connection failed:", err.message);
    });

export default pool;
