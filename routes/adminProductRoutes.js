import express from "express";
import {
    getAdminProducts,
    getAdminProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getDashboardStats
} from "../controllers/adminProductController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(protect);
router.use(admin);

router.get("/stats", getDashboardStats);

router.route("/")
    .get(getAdminProducts)
    .post(createProduct);

router.route("/:id")
    .get(getAdminProductById)
    .put(updateProduct)
    .delete(deleteProduct);

export default router;
