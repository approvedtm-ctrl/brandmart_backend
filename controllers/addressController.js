import pool from "../config/db.js";

// @desc  Get all addresses for user
// @route GET /api/addresses
// @access Protected
export const getAddresses = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT * FROM addresses WHERE user_id = ? ORDER BY created_at DESC",
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Add a new address
// @route POST /api/addresses
// @access Protected
export const addAddress = async (req, res) => {
    const { full_name, phone, address_line1, address_line2, city, state, country, postal_code } =
        req.body;

    try {
        const [result] = await pool.execute(
            `INSERT INTO addresses
                (user_id, full_name, phone, address_line1, address_line2, city, state, country, postal_code)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.id,
                full_name,
                phone,
                address_line1,
                address_line2 || null,
                city,
                state,
                country,
                postal_code,
            ]
        );
        res.status(201).json({ id: result.insertId, message: "Address saved" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Update an existing address
// @route PUT /api/addresses/:id
// @access Protected
export const updateAddress = async (req, res) => {
    const { full_name, phone, address_line1, address_line2, city, state, country, postal_code } =
        req.body;

    try {
        const [check] = await pool.execute(
            "SELECT id FROM addresses WHERE id = ? AND user_id = ?",
            [req.params.id, req.user.id]
        );
        if (check.length === 0) {
            return res.status(404).json({ message: "Address not found" });
        }

        await pool.execute(
            `UPDATE addresses
             SET full_name=?, phone=?, address_line1=?, address_line2=?,
                 city=?, state=?, country=?, postal_code=?
             WHERE id=?`,
            [
                full_name,
                phone,
                address_line1,
                address_line2 || null,
                city,
                state,
                country,
                postal_code,
                req.params.id,
            ]
        );
        res.json({ message: "Address updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Delete an address
// @route DELETE /api/addresses/:id
// @access Protected
export const deleteAddress = async (req, res) => {
    try {
        await pool.execute(
            "DELETE FROM addresses WHERE id = ? AND user_id = ?",
            [req.params.id, req.user.id]
        );
        res.json({ message: "Address deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
