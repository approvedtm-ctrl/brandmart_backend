import express from "express";
import { getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, admin);

router.get("/", getAllOrders);
router.put("/:id", updateOrderStatus);

export default router;
