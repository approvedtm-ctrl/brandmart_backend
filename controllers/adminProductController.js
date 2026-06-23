import pool from "../config/db.js";

/**
 * @desc Get dashboard statistics
 * @route GET /api/admin/stats
 */
export const getDashboardStats = async (req, res) => {
    try {
        const [[productCount]] = await pool.query("SELECT COUNT(*) as total FROM products");
        const [[inStockCount]] = await pool.query("SELECT COUNT(*) as total FROM products WHERE in_stock = 1");
        const [[outOfStockCount]] = await pool.query("SELECT COUNT(*) as total FROM products WHERE in_stock = 0");

        // Category breakdown
        const [categoryBreakdown] = await pool.query(
            "SELECT category, COUNT(*) as count FROM products GROUP BY category"
        );

        // Recent products (last 5)
        const [recentProducts] = await pool.query(
            "SELECT id, name, brand, category, price, image_url, in_stock, created_at FROM products ORDER BY created_at DESC LIMIT 5"
        );

        res.json({
            ok: true,
            stats: {
                totalProducts: productCount.total,
                inStock: inStockCount.total,
                outOfStock: outOfStockCount.total,
                categoryBreakdown,
                recentProducts,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Failed to fetch stats" });
    }
};


/**
 * @desc Get all products with filters and pagination for admin
 * @route GET /api/admin/products
 */
export const getAdminProducts = async (req, res) => {
    try {
        const { search, category, brand, sort } = req.query;

        const pageNum = Math.max(1, parseInt(req.query.page) || 1);
        const limitNum = Math.max(1, parseInt(req.query.limit) || 10);
        const offset = (pageNum - 1) * limitNum;

        let query = "SELECT * FROM products WHERE 1=1";
        let countQuery = "SELECT COUNT(*) as total FROM products WHERE 1=1";
        const queryParams = [];

        if (search) {
            query += " AND name LIKE ?";
            countQuery += " AND name LIKE ?";
            queryParams.push(`%${search}%`);
        }

        if (category && category !== "all") {
            query += " AND category = ?";
            countQuery += " AND category = ?";
            queryParams.push(category);
        }

        if (brand && brand !== "all") {
            query += " AND brand = ?";
            countQuery += " AND brand = ?";
            queryParams.push(brand);
        }

        if (sort === "newest") {
            query += " ORDER BY created_at DESC";
        } else if (sort === "oldest") {
            query += " ORDER BY created_at ASC";
        } else {
            query += " ORDER BY id DESC";
        }

        query += " LIMIT ? OFFSET ?";
        queryParams.push(limitNum, offset);

        const [rows] = await pool.query(query, queryParams);
        const [countResult] = await pool.query(countQuery, queryParams.slice(0, -2));

        res.json({
            ok: true,
            products: rows,
            pagination: {
                total: countResult[0].total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(countResult[0].total / limitNum)
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Failed to fetch products" });
    }
};

/**
 * @desc Get single product by ID for admin
 * @route GET /api/admin/products/:id
 */
export const getAdminProductById = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ ok: false, message: "Product not found" });
        }
        res.json({ ok: true, product: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Failed to fetch product" });
    }
};

/**
 * @desc Create new product
 * @route POST /api/admin/products
 */
export const createProduct = async (req, res) => {
    try {
        const {
            name, brand, category, price, rating, review_count, badge,
            image_url, short_description, long_description, specs,
            features, color, product_images, product_information, in_stock
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO products (
                name, brand, category, price, rating, review_count, badge,
                image_url, short_description, long_description, specs,
                features, color, product_images, product_information, in_stock
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name, brand, category, price, rating || 4.5, review_count || 0, badge,
                image_url, short_description, long_description,
                JSON.stringify(specs || {}),
                JSON.stringify(features || []),
                color,
                JSON.stringify(product_images || []),
                product_information,
                in_stock === undefined ? true : in_stock
            ]
        );

        res.status(201).json({ ok: true, id: result.insertId, message: "Product created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Failed to create product" });
    }
};

/**
 * @desc Update existing product
 * @route PUT /api/admin/products/:id
 */
export const updateProduct = async (req, res) => {
    try {
        const {
            name, brand, category, price, rating, review_count, badge,
            image_url, short_description, long_description, specs,
            features, color, product_images, product_information, in_stock
        } = req.body;

        const [result] = await pool.query(
            `UPDATE products SET
                name = ?, brand = ?, category = ?, price = ?, rating = ?,
                review_count = ?, badge = ?, image_url = ?, short_description = ?,
                long_description = ?, specs = ?, features = ?, color = ?,
                product_images = ?, product_information = ?, in_stock = ?
            WHERE id = ?`,
            [
                name, brand, category, price, rating, review_count, badge,
                image_url, short_description, long_description,
                JSON.stringify(specs || {}),
                JSON.stringify(features || []),
                color,
                JSON.stringify(product_images || []),
                product_information,
                in_stock,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Product not found" });
        }

        res.json({ ok: true, message: "Product updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Failed to update product" });
    }
};

/**
 * @desc Delete product
 * @route DELETE /api/admin/products/:id
 */
export const deleteProduct = async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Product not found" });
        }

        res.json({ ok: true, message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Failed to delete product" });
    }
};
