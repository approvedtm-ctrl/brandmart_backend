import pool from "../config/db.js";

// @desc  Get inventory for all products
// @route GET /api/admin/inventory
// @access Admin
export const getAllInventory = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT i.id, i.product_id, i.stock_quantity,
                    p.name, p.brand, p.category
             FROM inventory i
             JOIN products p ON i.product_id = p.id
             ORDER BY p.name ASC`
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Get inventory for a single product
// @route GET /api/admin/inventory/:productId
// @access Admin
export const getInventoryByProduct = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT i.*, p.name FROM inventory i
             JOIN products p ON i.product_id = p.id
             WHERE i.product_id = ?`,
            [req.params.productId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Inventory record not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Set stock quantity for a product (upsert)
// @route PUT /api/admin/inventory/:productId
// @access Admin
export const updateInventory = async (req, res) => {
    const { stock_quantity } = req.body;
    if (stock_quantity === undefined || stock_quantity < 0) {
        return res.status(400).json({ message: "Valid stock_quantity is required" });
    }

    try {
        await pool.execute(
            `INSERT INTO inventory (product_id, stock_quantity)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE stock_quantity = ?`,
            [req.params.productId, stock_quantity, stock_quantity]
        );
        res.json({ message: "Inventory updated", stock_quantity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
