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

async function runMigrations(conn) {
    try {
        console.log("🔄 Running payment system migrations...");
        
        // Helper to check if column exists
        const checkColumn = async (table, column) => {
            const [rows] = await conn.execute(
                `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
                [table, column]
            );
            return rows.length > 0;
        };

        // Orders table columns
        if (!(await checkColumn("orders", "order_number"))) {
            await conn.execute("ALTER TABLE orders ADD COLUMN order_number VARCHAR(100) UNIQUE NULL");
            console.log("✅ Added order_number to orders");
        }
        if (!(await checkColumn("orders", "payment_stage"))) {
            await conn.execute("ALTER TABLE orders ADD COLUMN payment_stage VARCHAR(50) DEFAULT 'initial'");
            console.log("✅ Added payment_stage to orders");
        }
        if (!(await checkColumn("orders", "initial_paid"))) {
            await conn.execute("ALTER TABLE orders ADD COLUMN initial_paid BOOLEAN DEFAULT FALSE");
            console.log("✅ Added initial_paid to orders");
        }
        if (!(await checkColumn("orders", "final_paid"))) {
            await conn.execute("ALTER TABLE orders ADD COLUMN final_paid BOOLEAN DEFAULT FALSE");
            console.log("✅ Added final_paid to orders");
        }
        if (!(await checkColumn("orders", "expires_at"))) {
            await conn.execute("ALTER TABLE orders ADD COLUMN expires_at TIMESTAMP NULL DEFAULT NULL");
            console.log("✅ Added expires_at to orders");
        }
        if (!(await checkColumn("orders", "updated_at"))) {
            await conn.execute("ALTER TABLE orders ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
            console.log("✅ Added updated_at to orders");
        }

        // Payments table columns
        if (!(await checkColumn("payments", "payment_type"))) {
            await conn.execute("ALTER TABLE payments ADD COLUMN payment_type VARCHAR(50) DEFAULT 'initial'");
            console.log("✅ Added payment_type to payments");
        }
        if (!(await checkColumn("payments", "utr"))) {
            await conn.execute("ALTER TABLE payments ADD COLUMN utr VARCHAR(100) UNIQUE NULL");
            console.log("✅ Added utr to payments");
        }
        if (!(await checkColumn("payments", "transaction_reference"))) {
            await conn.execute("ALTER TABLE payments ADD COLUMN transaction_reference VARCHAR(255) UNIQUE NULL");
            console.log("✅ Added transaction_reference to payments");
        }
        if (!(await checkColumn("payments", "verified_at"))) {
            await conn.execute("ALTER TABLE payments ADD COLUMN verified_at TIMESTAMP NULL DEFAULT NULL");
            console.log("✅ Added verified_at to payments");
        }
        
        console.log("✅ Migrations check completed successfully.");
    } catch (e) {
        console.error("❌ Migration error:", e);
    }
}

// Test connection and log success
pool.getConnection()
    .then(async (connection) => {
        console.log("✅ MySQL database connected successfully.");
        await runMigrations(connection);
        connection.release();
    })
    .catch((err) => {
        console.error("❌ MySQL connection failed:", err.message);
    });

export default pool;
