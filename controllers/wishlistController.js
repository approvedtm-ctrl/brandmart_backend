import pool from "../config/db.js";

// @desc  Get user's wishlist
// @route GET /api/wishlist
// @access Protected
export const getWishlist = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT w.id AS wishlist_id, w.created_at AS added_at,
                    p.id, p.name, p.brand, p.category, p.price,
                    p.rating, p.review_count, p.badge,
                    p.image_url, p.in_stock
             FROM wishlists w
             JOIN products p ON w.product_id = p.id
             WHERE w.user_id = ?
             ORDER BY w.created_at DESC`,
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Add product to wishlist
// @route POST /api/wishlist
// @access Protected
export const addToWishlist = async (req, res) => {
    const { product_id } = req.body;
    if (!product_id) {
        return res.status(400).json({ message: "product_id is required" });
    }

    try {
        // Check for duplicate
        const [existing] = await pool.execute(
            "SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?",
            [req.user.id, product_id]
        );
        if (existing.length > 0) {
            return res.status(400).json({ message: "Product already in wishlist" });
        }

        const [result] = await pool.execute(
            "INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)",
            [req.user.id, product_id]
        );

        res.status(201).json({ id: result.insertId, message: "Added to wishlist" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Remove product from wishlist
// @route DELETE /api/wishlist/:productId
// @access Protected
export const removeFromWishlist = async (req, res) => {
    try {
        await pool.execute(
            "DELETE FROM wishlists WHERE user_id = ? AND product_id = ?",
            [req.user.id, req.params.productId]
        );
        res.json({ message: "Removed from wishlist" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
