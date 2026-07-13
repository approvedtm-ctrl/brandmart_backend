import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    createPayment,
    verifyPayment,
    createFinalPayment,
    getPaymentStatus,
    getPaymentHistory
} from "../controllers/paymentController.js";

const router = express.Router();

router.use(protect);

router.post("/create", createPayment);
router.post("/verify", verifyPayment);
router.post("/final", createFinalPayment);
router.get("/status/:orderId", getPaymentStatus);
router.get("/history", getPaymentHistory);

export default router;
