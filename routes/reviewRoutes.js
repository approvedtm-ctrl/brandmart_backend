import express from "express";
import { getProductReviews, createReview, deleteReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

// GET /api/products/:productId/reviews  — public
router.get("/", getProductReviews);

// POST /api/products/:productId/reviews  — protected
router.post("/", protect, createReview);

// DELETE /api/products/:productId/reviews/:reviewId  — protected
router.delete("/:reviewId", protect, deleteReview);

export default router;
