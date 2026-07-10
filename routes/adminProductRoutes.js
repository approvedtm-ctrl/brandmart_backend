import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
    getAdminProducts,
    getAdminProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getDashboardStats,
    uploadProductImage
} from "../controllers/adminProductController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map category slug to public/ subfolder name
const CATEGORY_FOLDERS = {
    "smartphones": "Mobiles",
    "air-conditioners": "Ac's",
    "washing-machines": "Washing machine",
    "freeze": "Freeze",
    "solar_panel": "Solar_Panel",
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const category = req.query.category || req.body.category || "smartphones";
        const folder = CATEGORY_FOLDERS[category] || "Mobiles";
        const dest = path.join(__dirname, "../../public", folder);
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + file.originalname;
        cb(null, unique);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed"));
        }
        cb(null, true);
    },
});

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(protect);
router.use(admin);

router.get("/stats", getDashboardStats);

// Image upload route — must be before /:id routes
router.post("/upload", protect, admin, upload.single("image"), uploadProductImage);

router.route("/")
    .get(getAdminProducts)
    .post(createProduct);

router.route("/:id")
    .get(getAdminProductById)
    .put(updateProduct)
    .delete(deleteProduct);

export default router;
