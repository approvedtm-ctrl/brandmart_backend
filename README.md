# BrandMart Backend API

This is the backend API for the BrandMart e-commerce platform, built with Node.js, Express, and MySQL.

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    cd backend
    npm install
    ```

2.  **Environment Variables**:
    - Copy `.env.example` to `.env`.
    - Update the database credentials and `JWT_SECRET`.
    - Set `FRONTEND_URL` to your frontend's deployment URL (comma-separated for multiple).

3.  **Database Setup**:
    - Import the `db_setup.sql` file into your MySQL database.
    - (Optional) Run `node seed_admin.js` to create an initial admin user.

4.  **Run the Server**:
    - Development: `npm run dev`
    - Production: `npm start`

## API Endpoints

- `/api/auth` - Authentication (Register/Login)
- `/api/products` - Product Management
- `/api/categories` - Product Categories
- `/api/cart` - Shopping Cart
- `/api/orders` - Order Management
- `/api/addresses` - User Addresses
- `/api/coupons` - Discount Coupons
- `/api/admin` - Administrative interfaces

## Deployment

When deploying to a platform like Heroku, Render, or Railway:
- Ensure the environment variables are set in the platform's dashboard.
- The `start` script will run `node server.js`.
- Make sure your MySQL database is accessible from the deployment environment.
