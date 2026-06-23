import pool from "../config/db.js";

export const getProducts = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM products LIMIT 100");
        res.json({ ok: true, rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: String(err) });
    }
};

export const healthCheck = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 AS ok");
        res.json({ ok: true, rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: String(err) });
    }
};
