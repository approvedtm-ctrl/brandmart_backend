import pool from "../config/db.js";
import paymentService from "../services/paymentService.js";

// Helper to generate UPI Dynamic Link
const generateUpiUrl = (amount, tr) => {
    const pa = process.env.UPI_PA || "brandmart@upi";
    const pn = encodeURIComponent(process.env.UPI_PN || "BrandMart");
    const tn = encodeURIComponent(`Order Payment ${tr}`);
    return `upi://pay?pa=${pa}&pn=${pn}&am=${amount}&tr=${tr}&tn=${tn}&cu=INR`;
};

// @desc  Get payment status and remaining time for an order
// @route GET /api/payment/status/:orderId
// @access Protected
export const getPaymentStatus = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const userId = req.user.id;

        const [orders] = await pool.execute(
            "SELECT * FROM orders WHERE id = ? AND user_id = ?",
            [orderId, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        const order = orders[0];

        // Fetch payments details
        const [payments] = await pool.execute(
            "SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC",
            [orderId]
        );

        // Calculate time remaining in seconds
        let secondsRemaining = 0;
        if (order.expires_at) {
            const expiry = new Date(order.expires_at);
            const now = new Date();
            secondsRemaining = Math.max(0, Math.floor((expiry.getTime() - now.getTime()) / 1000));
        }

        res.json({
            orderId: order.id,
            orderNumber: order.order_number,
            totalAmount: Number(order.total_amount),
            paymentStage: order.payment_stage,
            initialPaid: Boolean(order.initial_paid),
            finalPaid: Boolean(order.final_paid),
            status: order.status,
            paymentStatus: order.payment_status,
            expiresAt: order.expires_at,
            secondsRemaining,
            payments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Create or retrieve initial payment details (₹1)
// @route POST /api/payment/create
// @access Protected
export const createPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user.id;

        const [orders] = await pool.execute(
            "SELECT * FROM orders WHERE id = ? AND user_id = ?",
            [orderId, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        const order = orders[0];

        if (order.status === "cancelled") {
            return res.status(400).json({ message: "Order has already been cancelled" });
        }

        if (order.initial_paid) {
            return res.status(400).json({ message: "Initial payment already completed" });
        }

        const amount = Number(order.total_amount);
        const txnRef = `TXN-INIT-${order.order_number}`;

        // Check if there is already a pending initial payment
        const [existing] = await pool.execute(
            "SELECT * FROM payments WHERE order_id = ? AND payment_type = 'initial' AND status = 'pending'",
            [orderId]
        );

        let paymentId;
        if (existing.length > 0) {
            paymentId = existing[0].id;
        } else {
            const [result] = await pool.execute(
                `INSERT INTO payments (order_id, payment_method, amount, status, payment_type, transaction_reference)
                 VALUES (?, 'upi', ?, 'pending', 'initial', ?)`,
                [orderId, amount, txnRef]
            );
            paymentId = result.insertId;
        }

        const upiUrl = generateUpiUrl(amount, txnRef);

        res.json({
            paymentId,
            orderId: order.id,
            orderNumber: order.order_number,
            amount,
            upiUrl,
            txnRef
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Verify P2P UPI payment using UTR
// @route POST /api/payment/verify
// @access Protected
export const verifyPayment = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { orderId, utr } = req.body;
        const userId = req.user.id;

        await conn.beginTransaction();

        // 1. Verify general order details
        const [orders] = await conn.execute(
            "SELECT * FROM orders WHERE id = ? AND user_id = ? FOR UPDATE",
            [orderId, userId]
        );

        if (orders.length === 0) {
            await conn.rollback();
            return res.status(404).json({ message: "Order not found" });
        }

        const order = orders[0];

        // 2. Determine payment stage and expected amount
        let paymentStage = "initial";
        let expectedAmount = Number(order.total_amount);

        if (order.initial_paid) {
            paymentStage = "final";
            expectedAmount = Math.max(0, Number(order.total_amount) - 1.0);
        }

        // 3. Perform verification checks through modular paymentService
        const verification = await paymentService.verifyUTR(orderId, utr, paymentStage, expectedAmount);

        if (!verification.success) {
            await conn.rollback();
            return res.status(400).json({ message: verification.message });
        }

        // 4. Update the payment entry
        await conn.execute(
            `UPDATE payments 
             SET status = 'success', transaction_id = ?, utr = ?, verified_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [`TXN-${utr}`, utr, verification.paymentId]
        );

        // 5. Update order details based on stage
        if (paymentStage === "initial") {
            // If they pay the full amount at once, both initial and final are marked paid.
            await conn.execute(
                `UPDATE orders 
                 SET initial_paid = TRUE, final_paid = TRUE, payment_status = 'COMPLETED', status = 'processing', payment_stage = 'final'
                 WHERE id = ?`,
                [orderId]
            );
        } else {
            // Final payment complete -> Completed
            await conn.execute(
                `UPDATE orders 
                 SET final_paid = TRUE, payment_status = 'COMPLETED', status = 'processing', payment_stage = 'final'
                 WHERE id = ?`,
                [orderId]
            );
        }

        await conn.commit();

        res.json({
            success: true,
            message: `Payment verified successfully for ${paymentStage} stage.`
        });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).json({ message: "Server error" });
    } finally {
        conn.release();
    }
};

// @desc  Create final payment details (remaining amount)
// @route POST /api/payment/final
// @access Protected
export const createFinalPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user.id;

        const [orders] = await pool.execute(
            "SELECT * FROM orders WHERE id = ? AND user_id = ?",
            [orderId, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        const order = orders[0];

        if (order.status === "cancelled") {
            return res.status(400).json({ message: "Order has already been cancelled" });
        }

        if (!order.initial_paid) {
            return res.status(400).json({ message: "Initial payment must be completed first" });
        }

        if (order.final_paid) {
            return res.status(400).json({ message: "Final payment already completed" });
        }

        // Check time limit
        if (order.expires_at && new Date(order.expires_at) < new Date()) {
            return res.status(400).json({ message: "The final payment window has expired" });
        }

        const amount = Math.max(0, Number(order.total_amount) - 1.00);
        const txnRef = `TXN-FINAL-${order.order_number}`;

        // Check if there is already a pending final payment
        const [existing] = await pool.execute(
            "SELECT * FROM payments WHERE order_id = ? AND payment_type = 'final' AND status = 'pending'",
            [orderId]
        );

        let paymentId;
        if (existing.length > 0) {
            paymentId = existing[0].id;
        } else {
            const [result] = await pool.execute(
                `INSERT INTO payments (order_id, payment_method, amount, status, payment_type, transaction_reference)
                 VALUES (?, 'upi', ?, 'pending', 'final', ?)`,
                [orderId, amount, txnRef]
            );
            paymentId = result.insertId;
        }

        const upiUrl = generateUpiUrl(amount, txnRef);

        res.json({
            paymentId,
            orderId: order.id,
            orderNumber: order.order_number,
            amount,
            upiUrl,
            txnRef
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Get payment history list for user
// @route GET /api/payment/history
// @access Protected
export const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const [payments] = await pool.execute(
            `SELECT p.*, o.order_number, o.total_amount 
             FROM payments p
             JOIN orders o ON p.order_id = o.id
             WHERE o.user_id = ?
             ORDER BY p.created_at DESC`,
            [userId]
        );
        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
