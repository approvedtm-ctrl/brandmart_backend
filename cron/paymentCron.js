import cron from "node-cron";
import pool from "../config/db.js";

/**
 * Initialize payment system cron task
 * Runs every minute to search for:
 * - initial_paid = true
 * - final_paid = false
 * - expires_at < NOW()
 * And automatically cancels those orders, sets payments as failed or expired, and updates stock inventory.
 */
export const initPaymentCron = () => {
    // Run every minute
    cron.schedule("* * * * *", async () => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ⏰ Running UPI Split-Payment Expiration Check...`);

        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // Find expired orders
            const [expiredOrders] = await conn.execute(
                `SELECT id, order_number FROM orders 
                 WHERE initial_paid = TRUE 
                   AND final_paid = FALSE 
                   AND expires_at IS NOT NULL 
                   AND expires_at < NOW()
                   AND status != 'cancelled'`
            );

            if (expiredOrders.length === 0) {
                await conn.commit();
                return;
            }

            console.log(`[${timestamp}] found ${expiredOrders.length} expired orders to cancel.`);

            for (const order of expiredOrders) {
                console.log(`[${timestamp}] ⏳ Cancelling expired order: ${order.order_number} (ID: ${order.id})`);

                // 1. Update order status to cancelled
                await conn.execute(
                    `UPDATE orders 
                     SET status = 'cancelled', payment_status = 'failed'
                     WHERE id = ?`,
                    [order.id]
                );

                // 2. Set any pending final payments for this order as failed
                await conn.execute(
                    `UPDATE payments 
                     SET status = 'failed' 
                     WHERE order_id = ? AND payment_type = 'final' AND status = 'pending'`,
                    [order.id]
                );

                // 3. Put items back in inventory
                const [orderItems] = await conn.execute(
                    "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
                    [order.id]
                );

                for (const item of orderItems) {
                    await conn.execute(
                        `UPDATE inventory 
                         SET stock_quantity = stock_quantity + ? 
                         WHERE product_id = ?`,
                        [item.quantity, item.product_id]
                    );
                }
            }

            await conn.commit();
            console.log(`[${timestamp}] Successfully expired ${expiredOrders.length} orders.`);
        } catch (error) {
            await conn.rollback();
            console.error(`[${timestamp}] ❌ Error running payment cron:`, error);
        } finally {
            conn.release();
        }
    });
    console.log("✅ UPI Payment Expiry Cron Worker scheduled successfully (resolves every minute).");
};
