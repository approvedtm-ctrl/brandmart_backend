import express from "express";
import { validateCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from "../controllers/couponController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Validate coupon — protected (user must be logged in)
router.post("/validate", protect, validateCoupon);

// Admin coupon management
router.get("/admin", protect, admin, getAllCoupons);
router.post("/admin", protect, admin, createCoupon);
router.put("/admin/:id", protect, admin, updateCoupon);
router.delete("/admin/:id", protect, admin, deleteCoupon);

export default router;
