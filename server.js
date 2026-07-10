import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const origins = [process.env.FRONTEND_URL, "http://localhost:8080", "http://localhost:5173", "http://localhost:5174"];

app.use(cors({
    origin: origins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Fallback static serving of category folders from the public/ directory
const foldersToServe = ["Mobiles", "Ac's", "Washing machine", "Freeze", "Solar_Panel"];
foldersToServe.forEach((folder) => {
    app.use(`/${folder}`, express.static(path.join(__dirname, "../public", folder)));
});

// Existing routes
app.use("/api", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin/products", adminProductRoutes);

// New feature routes
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/products/:productId/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/admin/inventory", inventoryRoutes);

const port = process.env.API_PORT || 5000;
app.listen(port, () => {
    console.log(`Server API running on ${port}`);
});
