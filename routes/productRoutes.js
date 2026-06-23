import express from "express";
import { getProducts, healthCheck } from "../controllers/productController.js";

const router = express.Router();

router.get("/health", healthCheck);
router.get("/products", getProducts);

export default router;
