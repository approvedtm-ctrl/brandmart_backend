import pool from "../config/db.js";

// Helper: get or create a cart for a user
async function getOrCreateCart(userId) {
    const [carts] = await pool.execute(
        "SELECT id FROM carts WHERE user_id = ? LIMIT 1",
        [userId]
    );
    if (carts.length > 0) return carts[0].id;

    const [result] = await pool.execute(
        "INSERT INTO carts (user_id) VALUES (?)",
        [userId]
    );
    return result.insertId;
}

// @desc  Get cart with items
// @route GET /api/cart
// @access Protected
export const getCart = async (req, res) => {
    try {
        const cartId = await getOrCreateCart(req.user.id);

        const [items] = await pool.execute(
            `SELECT ci.id, ci.quantity, ci.product_id,
                    p.name, p.brand, p.category, p.price,
                    p.image_url, p.in_stock,
                    COALESCE(inv.stock_quantity, 999) AS stock_quantity
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             LEFT JOIN inventory inv ON inv.product_id = p.id
             WHERE ci.cart_id = ?`,
            [cartId]
        );

        res.json({ cartId, items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Add item to cart (or increment quantity)
// @route POST /api/cart/items
// @access Protected
export const addToCart = async (req, res) => {
    const { product_id, quantity = 1 } = req.body;
    if (!product_id) {
        return res.status(400).json({ message: "product_id is required" });
    }

    try {
        const cartId = await getOrCreateCart(req.user.id);

        // Check if item already in cart
        const [existing] = await pool.execute(
            "SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?",
            [cartId, product_id]
        );

        if (existing.length > 0) {
            const newQty = existing[0].quantity + Number(quantity);
            await pool.execute(
                "UPDATE cart_items SET quantity = ? WHERE id = ?",
                [newQty, existing[0].id]
            );
        } else {
            await pool.execute(
                "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
                [cartId, product_id, quantity]
            );
        }

        res.status(201).json({ message: "Item added to cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Update cart item quantity
// @route PUT /api/cart/items/:itemId
// @access Protected
export const updateCartItem = async (req, res) => {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Valid quantity required" });
    }

    try {
        const cartId = await getOrCreateCart(req.user.id);

        const [rows] = await pool.execute(
            "SELECT id FROM cart_items WHERE id = ? AND cart_id = ?",
            [req.params.itemId, cartId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        await pool.execute(
            "UPDATE cart_items SET quantity = ? WHERE id = ?",
            [quantity, req.params.itemId]
        );

        res.json({ message: "Cart item updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Remove item from cart
// @route DELETE /api/cart/items/:productId
// @access Protected
export const removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ message: "productId is required" });
        }

        const cartId = await getOrCreateCart(req.user.id);

        await pool.execute(
            "DELETE FROM cart_items WHERE product_id = ? AND cart_id = ?",
            [productId, cartId]
        );

        res.json({ message: "Item removed from cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Clear all items from cart
// @route DELETE /api/cart
// @access Protected
export const clearCart = async (req, res) => {
    try {
        const cartId = await getOrCreateCart(req.user.id);
        await pool.execute("DELETE FROM cart_items WHERE cart_id = ?", [cartId]);
        res.json({ message: "Cart cleared" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Export helper for use in orderController
export { getOrCreateCart };
