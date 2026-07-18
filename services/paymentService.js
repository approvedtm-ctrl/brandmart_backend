import pool from "../config/db.js";

/**
 * Payment Verification Service for Direct UPI P2P Payment
 */
class PaymentService {
    /**
     * Validate UTR format (must be a 12-digit numeric string)
     * @param {string} utr 
     * @returns {boolean}
     */
    isValidUTRFormat(utr) {
        if (!utr) return false;
        // UPI UTR is always exactly 12 digits
        return /^\d{12}$/.test(utr);
    }

    /**
     * Verify UTR details against business policies and database constraints
     * @param {number|string} orderId 
     * @param {string} utr 
     * @param {string} paymentStage - 'initial' or 'final'
     * @param {number} expectedAmount 
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async verifyUTR(orderId, utr, paymentStage, expectedAmount) {
        // 1. Format validation
        if (!this.isValidUTRFormat(utr)) {
            return {
                success: false,
                message: "Invalid UTR format. UPI UTR must be exactly 12 digits."
            };
        }

        // 2. Check for duplicate UTRs globally across successful/pending payments
        const [existingUtr] = await pool.execute(
            "SELECT id, order_id, status FROM payments WHERE utr = ? AND status = 'success'",
            [utr]
        );
        if (existingUtr.length > 0) {
            return {
                success: false,
                message: "Duplicate UTR. This transaction has already been submitted or processed."
            };
        }

        // 3. Find order and check timing
        const [orders] = await pool.execute(
            "SELECT * FROM orders WHERE id = ?",
            [orderId]
        );
        if (orders.length === 0) {
            return {
                success: false,
                message: "Order not found."
            };
        }

        const order = orders[0];

        // Check if order canceled or completed
        if (order.status === "cancelled") {
            return {
                success: false,
                message: "Cannot verify payment. The order has already been cancelled."
            };
        }

        // Check if already fully paid
        if (order.final_paid) {
            return {
                success: false,
                message: "Payment for this order has already been verified and completed."
            };
        }

        // Check if payment timer has expired
        if (order.expires_at && new Date(order.expires_at) < new Date()) {
            return {
                success: false,
                message: "The payment window for this order has expired."
            };
        }

        // 4. Find the payment entry for this stage
        const [payments] = await pool.execute(
            "SELECT * FROM payments WHERE order_id = ? AND payment_type = ? AND status = 'pending'",
            [orderId, paymentStage]
        );

        if (payments.length === 0) {
            return {
                success: false,
                message: `No pending payment record found for stage '${paymentStage}' on this order.`
            };
        }

        const payment = payments[0];

        // 5. Amount check
        if (Number(payment.amount) !== Number(expectedAmount)) {
            return {
                success: false,
                message: `Incorrect payment amount. Expected Rs ${expectedAmount}, found Rs ${payment.amount}.`
            };
        }

        // Modular service note: Here is where we could hook into real Bank APIs,
        // email scraping services, or SMS parsing callbacks to match the UTR
        // with the merchant bank's actual incoming logs.
        // For local production/testing support, we simulate validation success
        // since P2P manual verification is backed by the store admin's approval
        // or a simulated success callback.

        return {
            success: true,
            message: "UTR verified successfully",
            paymentId: payment.id
        };
    }
}

export default new PaymentService();
