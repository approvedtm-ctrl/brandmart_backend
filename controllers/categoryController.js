import pool from "../config/db.js";

// @desc  Get all categories
// @route GET /api/categories
// @access Public
export const getCategories = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT * FROM categories ORDER BY name ASC"
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Get single category by slug
// @route GET /api/categories/:slug
// @access Public
export const getCategoryBySlug = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT * FROM categories WHERE slug = ?",
            [req.params.slug]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Create a category
// @route POST /api/categories
// @access Admin
export const createCategory = async (req, res) => {
    const { name, slug } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Category name is required" });
    }
    try {
        const computedSlug = slug || name.toLowerCase().replace(/\s+/g, "-");
        const [result] = await pool.execute(
            "INSERT INTO categories (name, slug) VALUES (?, ?)",
            [name, computedSlug]
        );
        res.status(201).json({ id: result.insertId, name, slug: computedSlug });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Category already exists" });
        }
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Update a category
// @route PUT /api/categories/:id
// @access Admin
export const updateCategory = async (req, res) => {
    const { name, slug } = req.body;
    try {
        await pool.execute(
            "UPDATE categories SET name = ?, slug = ? WHERE id = ?",
            [name, slug, req.params.id]
        );
        res.json({ message: "Category updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Delete a category
// @route DELETE /api/categories/:id
// @access Admin
export const deleteCategory = async (req, res) => {
    try {
        await pool.execute("DELETE FROM categories WHERE id = ?", [req.params.id]);
        res.json({ message: "Category deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
