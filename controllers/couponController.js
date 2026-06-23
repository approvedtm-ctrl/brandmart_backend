import pool from "../config/db.js";

// @desc  Validate a coupon code
// @route POST /api/coupons/validate
// @access Protected
export const validateCoupon = async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ message: "Coupon code is required" });
    }

    try {
        const [rows] = await pool.execute(
            `SELECT id, code, discount, expiry_date, active
             FROM coupons
             WHERE code = ?`,
            [code.trim().toUpperCase()]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Invalid coupon code" });
        }

        const coupon = rows[0];

        if (!coupon.active) {
            return res.status(400).json({ message: "This coupon is no longer active" });
        }

        if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
            return res.status(400).json({ message: "This coupon has expired" });
        }

        res.json({
            valid: true,
            code: coupon.code,
            discount: Number(coupon.discount),
            message: `Coupon applied! ₹${coupon.discount} off your order.`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Get all coupons (admin)
// @route GET /api/admin/coupons
// @access Admin
export const getAllCoupons = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT * FROM coupons ORDER BY created_at DESC"
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Create a coupon (admin)
// @route POST /api/admin/coupons
// @access Admin
export const createCoupon = async (req, res) => {
    const { code, discount, expiry_date, active = true } = req.body;
    if (!code || !discount) {
        return res.status(400).json({ message: "code and discount are required" });
    }

    try {
        const [result] = await pool.execute(
            `INSERT INTO coupons (code, discount, expiry_date, active)
             VALUES (?, ?, ?, ?)`,
            [code.trim().toUpperCase(), discount, expiry_date || null, active]
        );
        res.status(201).json({ id: result.insertId, message: "Coupon created" });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Coupon code already exists" });
        }
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Toggle coupon active status (admin)
// @route PUT /api/admin/coupons/:id
// @access Admin
export const updateCoupon = async (req, res) => {
    const { code, discount, expiry_date, active } = req.body;
    try {
        await pool.execute(
            `UPDATE coupons SET code=?, discount=?, expiry_date=?, active=? WHERE id=?`,
            [code, discount, expiry_date || null, active, req.params.id]
        );
        res.json({ message: "Coupon updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Delete a coupon (admin)
// @route DELETE /api/admin/coupons/:id
// @access Admin
export const deleteCoupon = async (req, res) => {
    try {
        await pool.execute("DELETE FROM coupons WHERE id = ?", [req.params.id]);
        res.json({ message: "Coupon deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
