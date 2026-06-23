import pool from "../config/db.js";
import { getOrCreateCart } from "./cartController.js";

// @desc  Create a new order from cart items
// @route POST /api/orders
// @access Protected
export const createOrder = async (req, res) => {
    const { shipping_address, payment_method = "cod", coupon_code } = req.body;
    const userId = req.user.id;

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Get cart
        const cartId = await getOrCreateCart(userId);
        const [cartItems] = await conn.execute(
            `SELECT ci.product_id, ci.quantity, p.price, p.name
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.cart_id = ?`,
            [cartId]
        );

        if (cartItems.length === 0) {
            await conn.rollback();
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Resolve coupon discount
        let discountAmount = 0;
        if (coupon_code) {
            const [coupons] = await conn.execute(
                `SELECT discount FROM coupons
                 WHERE code = ? AND active = TRUE
                   AND (expiry_date IS NULL OR expiry_date >= CURDATE())`,
                [coupon_code]
            );
            if (coupons.length > 0) {
                discountAmount = Number(coupons[0].discount);
            }
        }

        // Calculate total
        const subtotal = cartItems.reduce(
            (sum, item) => sum + Number(item.price) * item.quantity,
            0
        );
        const tax = subtotal * 0.1;
        const shipping = subtotal > 500 ? 0 : 50;
        const totalAmount = Math.max(0, subtotal - discountAmount) + tax + shipping;

        // Insert order
        const [orderResult] = await conn.execute(
            `INSERT INTO orders (user_id, total_amount, status, payment_status)
             VALUES (?, ?, 'pending', 'pending')`,
            [userId, totalAmount]
        );
        const orderId = orderResult.insertId;

        // Insert order items
        for (const item of cartItems) {
            await conn.execute(
                `INSERT INTO order_items (order_id, product_id, quantity, price)
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price]
            );

            // Decrement inventory if record exists
            await conn.execute(
                `UPDATE inventory SET stock_quantity = GREATEST(0, stock_quantity - ?)
                 WHERE product_id = ?`,
                [item.quantity, item.product_id]
            );
        }

        // Save shipping address if provided
        if (shipping_address) {
            await conn.execute(
                `INSERT INTO addresses (user_id, full_name, phone, address_line1, city, state, country, postal_code)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE address_line1 = VALUES(address_line1)`,
                [
                    userId,
                    shipping_address.full_name || "",
                    shipping_address.phone || "",
                    shipping_address.address_line1 || "",
                    shipping_address.city || "",
                    shipping_address.state || "",
                    shipping_address.country || "India",
                    shipping_address.postal_code || "",
                ]
            );
        }

        // Record payment
        await conn.execute(
            `INSERT INTO payments (order_id, payment_method, amount, status)
             VALUES (?, ?, ?, ?)`,
            [
                orderId,
                payment_method,
                totalAmount,
                payment_method === "cod" ? "pending" : "pending",
            ]
        );

        // Update order payment_status if card (simulated success)
        if (payment_method === "card") {
            await conn.execute(
                `UPDATE orders SET status = 'paid', payment_status = 'paid' WHERE id = ?`,
                [orderId]
            );
            await conn.execute(
                `UPDATE payments SET status = 'success', transaction_id = ? WHERE order_id = ?`,
                [`TXN-${Date.now()}`, orderId]
            );
        }

        // Clear cart
        await conn.execute("DELETE FROM cart_items WHERE cart_id = ?", [cartId]);

        await conn.commit();

        res.status(201).json({
            message: "Order placed successfully",
            orderId,
            orderNumber: `BM-${orderId.toString().padStart(6, "0")}`,
            totalAmount,
        });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).json({ message: "Server error while placing order" });
    } finally {
        conn.release();
    }
};

// @desc  Get all orders for logged-in user
// @route GET /api/orders
// @access Protected
export const getMyOrders = async (req, res) => {
    try {
        const [orders] = await pool.execute(
            `SELECT o.id, o.total_amount, o.status, o.payment_status, o.created_at
             FROM orders o
             WHERE o.user_id = ?
             ORDER BY o.created_at DESC`,
            [req.user.id]
        );

        // Fetch items for each order
        for (const order of orders) {
            const [items] = await pool.execute(
                `SELECT oi.quantity, oi.price,
                        p.name, p.brand, p.image_url
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?`,
                [order.id]
            );
            order.items = items;
            order.orderNumber = `BM-${order.id.toString().padStart(6, "0")}`;
        }

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Get single order by ID
// @route GET /api/orders/:id
// @access Protected
export const getOrderById = async (req, res) => {
    try {
        const [orders] = await pool.execute(
            `SELECT o.*, p.payment_method, p.transaction_id
             FROM orders o
             LEFT JOIN payments p ON p.order_id = o.id
             WHERE o.id = ? AND o.user_id = ?`,
            [req.params.id, req.user.id]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        const order = orders[0];
        const [items] = await pool.execute(
            `SELECT oi.quantity, oi.price, p.name, p.brand, p.image_url, p.category
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [order.id]
        );

        order.items = items;
        order.orderNumber = `BM-${order.id.toString().padStart(6, "0")}`;

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Admin: Get all orders
// @route GET /api/admin/orders
// @access Admin
export const getAllOrders = async (req, res) => {
    try {
        const [orders] = await pool.execute(
            `SELECT o.id, o.total_amount, o.status, o.payment_status, o.created_at,
                    u.name AS user_name, u.email AS user_email
             FROM orders o
             JOIN users u ON o.user_id = u.id
             ORDER BY o.created_at DESC`
        );

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Admin: Update order status
// @route PUT /api/admin/orders/:id
// @access Admin
export const updateOrderStatus = async (req, res) => {
    const { status, payment_status } = req.body;
    try {
        await pool.execute(
            `UPDATE orders SET status = ?, payment_status = ? WHERE id = ?`,
            [status, payment_status, req.params.id]
        );
        res.json({ message: "Order updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
