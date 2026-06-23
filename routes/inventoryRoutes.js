import express from "express";
import { getAllInventory, getInventoryByProduct, updateInventory } from "../controllers/inventoryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, admin);

router.get("/", getAllInventory);
router.get("/:productId", getInventoryByProduct);
router.put("/:productId", updateInventory);

export default router;
