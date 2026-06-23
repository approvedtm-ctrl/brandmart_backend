import pool from "../config/db.js";

// @desc  Get reviews for a product
// @route GET /api/products/:productId/reviews
// @access Public
export const getProductReviews = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT r.id, r.rating, r.comment, r.created_at,
                    u.name AS user_name
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             WHERE r.product_id = ?
             ORDER BY r.created_at DESC`,
            [req.params.productId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Create a review for a product
// @route POST /api/products/:productId/reviews
// @access Protected
export const createReview = async (req, res) => {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Check if product exists
        const [products] = await conn.execute(
            "SELECT id FROM products WHERE id = ?",
            [req.params.productId]
        );
        if (products.length === 0) {
            await conn.rollback();
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if user already reviewed this product
        const [existing] = await conn.execute(
            "SELECT id FROM reviews WHERE user_id = ? AND product_id = ?",
            [req.user.id, req.params.productId]
        );
        if (existing.length > 0) {
            await conn.rollback();
            return res.status(400).json({ message: "You have already reviewed this product" });
        }

        // Insert review
        const [result] = await conn.execute(
            `INSERT INTO reviews (user_id, product_id, rating, comment)
             VALUES (?, ?, ?, ?)`,
            [req.user.id, req.params.productId, rating, comment || null]
        );

        // Recalculate and update product rating & review_count
        const [stats] = await conn.execute(
            `SELECT COUNT(*) AS cnt, AVG(rating) AS avg_rating
             FROM reviews WHERE product_id = ?`,
            [req.params.productId]
        );
        const { cnt, avg_rating } = stats[0];

        await conn.execute(
            `UPDATE products SET rating = ?, review_count = ? WHERE id = ?`,
            [Math.round(avg_rating * 10) / 10, cnt, req.params.productId]
        );

        await conn.commit();

        res.status(201).json({
            id: result.insertId,
            message: "Review submitted",
            rating,
            comment,
        });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).json({ message: "Server error" });
    } finally {
        conn.release();
    }
};

// @desc  Delete own review
// @route DELETE /api/products/:productId/reviews/:reviewId
// @access Protected
export const deleteReview = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [rows] = await conn.execute(
            "SELECT id FROM reviews WHERE id = ? AND user_id = ?",
            [req.params.reviewId, req.user.id]
        );
        if (rows.length === 0) {
            await conn.rollback();
            return res.status(404).json({ message: "Review not found" });
        }

        await conn.execute("DELETE FROM reviews WHERE id = ?", [req.params.reviewId]);

        // Recalculate rating
        const [stats] = await conn.execute(
            `SELECT COUNT(*) AS cnt, AVG(rating) AS avg_rating
             FROM reviews WHERE product_id = ?`,
            [req.params.productId]
        );
        const { cnt, avg_rating } = stats[0];

        await conn.execute(
            `UPDATE products SET rating = ?, review_count = ? WHERE id = ?`,
            [avg_rating ? Math.round(avg_rating * 10) / 10 : 0, cnt, req.params.productId]
        );

        await conn.commit();
        res.json({ message: "Review deleted" });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).json({ message: "Server error" });
    } finally {
        conn.release();
    }
};
