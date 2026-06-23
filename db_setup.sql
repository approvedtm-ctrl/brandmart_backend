-- Create Products Table with full fields for frontend integration
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 4.5,
    review_count INT DEFAULT 100,
    badge VARCHAR(50),
    image_url VARCHAR(280),
    short_description TEXT,
    long_description TEXT,
    specs JSON,
    features JSON,
    color VARCHAR(50),
    product_images JSON,
    product_information TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TRUNCATE TABLE products;

-- 1. SMARTPHONES (INR Prices: 1 USD ≈ 83 INR)
INSERT INTO products (name, brand, category, price, rating, review_count, badge, image_url, short_description, long_description, specs, features) VALUES
-- Apple
('iPhone 12', 'Apple', 'smartphones', 49900.00, 4.5, 1250, 'Best Seller', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'A14 Bionic, 5G speed.', 'A14 Bionic chip, 5G speed, Super Retina XDR display.', '{"Display": "6.1-inch", "storage": "128GB"}', '["5G Capable", "Night mode"]'),
('iPhone 12 Pro', 'Apple', 'smartphones', 59900.00, 4.6, 980, NULL, 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Pro camera system.', 'Pro camera system, LiDAR Scanner for enhanced AR.', '{"Display": "6.1-inch", "storage": "256GB"}', '["LiDAR", "ProRAW"]'),
('iPhone 12 Pro Max', 'Apple', 'smartphones', 69900.00, 4.7, 1100, 'Premium', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Largest display.', 'The largest display on an iPhone 12 Pro.', '{"Display": "6.7-inch"}', '["Max Power", "Max Size"]'),
('iPhone 12 mini', 'Apple', 'smartphones', 42900.00, 4.4, 850, NULL, 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Compact performance.', 'Full iPhone 12 power in a smaller form factor.', '{"Display": "5.4-inch"}', '["Compact", "5G"]'),
('iPhone 13', 'Apple', 'smartphones', 54900.00, 4.6, 1400, 'Best Seller', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'A15 Bionic, Dual CPU.', 'The legendary iPhone 13 experience.', '{"Display": "6.1-inch"}', '["Cinema mode", "OIS"]'),
('iPhone 13 Pro', 'Apple', 'smartphones', 84900.00, 4.7, 1500, 'Premium', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'ProMotion display.', 'ProMotion display, cinematic mode, and massive battery life.', '{"Display": "6.1-inch", "Refresh": "120Hz"}', '["ProMotion", "Cinematic mode"]'),
('iPhone 13 Pro Max', 'Apple', 'smartphones', 94900.00, 4.8, 1600, 'Premium', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'Ultimate battery.', 'Best battery life on an iPhone 13.', '{"Display": "6.7-inch"}', '["Max Battery", "ProVision"]'),
('iPhone 13 mini', 'Apple', 'smartphones', 46900.00, 4.5, 700, NULL, 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'Small size, big power.', 'The last compact flagship.', '{"Display": "5.4-inch"}', '["Compact", "Powerful"]'),
('iPhone 14', 'Apple', 'smartphones', 64900.00, 4.5, 1200, NULL, 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800', 'Crash Detection.', 'Action mode and safety features.', '{"Display": "6.1-inch"}', '["Safety", "Action mode"]'),
('iPhone 14 Plus', 'Apple', 'smartphones', 74900.00, 4.5, 900, NULL, 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800', 'Big screen 14.', 'Large display for the standard series.', '{"Display": "6.7-inch"}', '["Big Screen", "Long Battery"]'),
('iPhone 14 Pro', 'Apple', 'smartphones', 99900.00, 4.7, 1100, 'Premium', 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800', '48MP Camera.', 'Dynamic Island and Always-on display.', '{"Display": "6.1-inch", "Chip": "A16"}', '["Dynamic Island", "48MP"]'),
('iPhone 14 Pro Max', 'Apple', 'smartphones', 109900.00, 4.8, 1300, 'Premium', 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800', 'The peak iPhone 14.', 'The ultimate Pro performance.', '{"Display": "6.7-inch"}', '["Premium", "Max Performance"]'),
('iPhone 15', 'Apple', 'smartphones', 79900.00, 4.6, 1400, 'Best Seller', 'https://images.unsplash.com/photo-1695048133142-1a20484d2509?w=800', 'USB-C arrives.', 'Dynamic Island for all.', '{"Display": "6.1-inch", "Port": "USB-C"}', '["Dynamic Island", "USB-C"]'),
('iPhone 15 Plus', 'Apple', 'smartphones', 89900.00, 4.6, 1000, NULL, 'https://images.unsplash.com/photo-1695048133142-1a20484d2509?w=800', 'Big screen USB-C.', 'Greater autonomy and display.', '{"Display": "6.7-inch"}', '["Big Battery", "Dynamic Island"]'),
('iPhone 15 Pro', 'Apple', 'smartphones', 119900.00, 4.7, 1200, 'Premium', 'https://images.unsplash.com/photo-1695048133142-1a20484d2509?w=800', 'Titanium design.', 'Strong and light titanium design.', '{"Display": "6.1-inch", "Chip": "A17 Pro"}', '["Titanium", "Ray Tracing"]'),
('iPhone 15 Pro Max', 'Apple', 'smartphones', 139900.00, 4.8, 1500, 'Premium', 'https://images.unsplash.com/photo-1695048133142-1a20484d2509?w=800', '5x Zoom.', 'Advanced telephoto capabilities.', '{"Display": "6.7-inch", "Zoom": "5x Optical"}', '["Tetraprism", "Pro Performance"]'),
('iPhone 16', 'Apple', 'smartphones', 89900.00, 4.8, 600, 'New', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'AI integrated.', 'Apple Intelligence core.', '{"Display": "6.1-inch"}', '["AI", "Capture Button"]'),
('iPhone 16 Plus', 'Apple', 'smartphones', 99900.00, 4.8, 400, 'New', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'Large screen AI.', 'Apple Intelligence on a large canvas.', '{"Display": "6.7-inch"}', '["AI Ready", "Big Display"]'),
('iPhone 16 Pro', 'Apple', 'smartphones', 129900.00, 4.9, 550, 'New', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'Pro Intelligence.', 'Redefined Pro performance with AI.', '{"Display": "6.3-inch"}', '["Pro Intelligence", "A18 Pro"]'),
('iPhone 16 Pro Max', 'Apple', 'smartphones', 149900.00, 4.9, 500, 'New', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'The ultimate iPhone.', 'The peak of iPhone technology with Apple Intelligence.', '{"Display": "6.9-inch", "Chip": "A18 Pro"}', '["AI Enhanced", "Titanium"]'),
('iPhone 16e', 'Apple', 'smartphones', 69900.00, 4.5, 200, 'New', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'Essential 16.', 'Perfect balance for 16 series.', '{"Display": "6.1-inch"}', '["Value", "16 Series"]'),
('iPhone 17', 'Apple', 'smartphones', 99900.00, 4.7, 50, 'Coming Soon', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'Next Gen Standard.', 'Future of everyday mobile technology.', '{"Display": "6.1-inch"}', '["Next Gen", "Future Tech"]'),
('iPhone 17 Pro', 'Apple', 'smartphones', 139900.00, 4.9, 30, 'Coming Soon', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'Future Pro.', 'Redefining professional performance.', '{"Display": "6.3-inch"}', '["Hyper Speed", "Pro AI"]'),
('iPhone 17 Pro Max', 'Apple', 'smartphones', 159900.00, 4.9, 20, 'Coming Soon', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'Peak Evolution.', 'The absolute ultimate smartphone experience.', '{"Display": "6.9-inch"}', '["Limitless", "Ultimate AI"]'),
('iPhone Air', 'Apple', 'smartphones', 84900.00, 4.6, 100, 'New Concept', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'Ultra Thin.', 'Thinnest smartphone ever made.', '{"Thickness": "5.1mm"}', '["Lightweight", "Iconic"]'),

-- Samsung
('Galaxy S20', 'Samsung', 'smartphones', 35900.00, 4.3, 2000, NULL, 'https://images.unsplash.com/photo-1583573636246-18cb2246697f?w=800', 'Classic S20.', 'Reliable flagship performance.', '{"Display": "6.2-inch"}', '["120Hz", "Exynos"]'),
('Galaxy S20+', 'Samsung', 'smartphones', 40900.00, 4.3, 1500, NULL, 'https://images.unsplash.com/photo-1583573636246-18cb2246697f?w=800', 'Bigger S20.', 'More screen, more battery.', '{"Display": "6.7-inch"}', '["Large Display", "S20 Series"]'),
('Galaxy S20 Ultra', 'Samsung', 'smartphones', 55900.00, 4.4, 1200, NULL, 'https://images.unsplash.com/photo-1583573636246-18cb2246697f?w=800', '100x Space Zoom.', 'Original ultra powerhouse.', '{"Display": "6.9-inch"}', '["100x Zoom", "5000mAh"]'),
('Galaxy S21', 'Samsung', 'smartphones', 38900.00, 4.4, 1800, NULL, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Contour-cut design.', 'Everyday epic experience.', '{"Display": "6.2-inch"}', '["8K Video", "Compact"]'),
('Galaxy S21+', 'Samsung', 'smartphones', 45900.00, 4.4, 1300, NULL, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Stunning Pro.', 'Balanced power and size.', '{"Display": "6.7-inch"}', '["Metal Build", "AMOLED"]'),
('Galaxy S21 Ultra', 'Samsung', 'smartphones', 65900.00, 4.6, 1600, 'Premium', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Epic in every way.', 'Original S Pen support for S series.', '{"Display": "6.8-inch"}', '["S Pen Sync", "108MP"]'),
('Galaxy S22', 'Samsung', 'smartphones', 45900.00, 4.4, 1400, NULL, 'https://images.unsplash.com/photo-1644131561001-3832c3f87309?w=800', 'Nightography king.', 'Professional grade photography.', '{"Display": "6.1-inch"}', '["Night Mode", "Snapdragon"]'),
('Galaxy S22+', 'Samsung', 'smartphones', 52900.00, 4.4, 1100, NULL, 'https://images.unsplash.com/photo-1644131561001-3832c3f87309?w=800', 'Brightest screen.', 'Vision Booster for outdoors.', '{"Display": "6.6-inch"}', '["Bright Display", "Fast Charge"]'),
('Galaxy S22 Ultra', 'Samsung', 'smartphones', 79900.00, 4.7, 1500, 'Prime', 'https://images.unsplash.com/photo-1644131561001-3832c3f87309?w=800', 'Note redefined.', 'Built-in S Pen and iconic design.', '{"Display": "6.8-inch", "Pen": "Built-in"}', '["S Pen", "Note Design"]'),
('Galaxy S23', 'Samsung', 'smartphones', 55900.00, 4.5, 1300, NULL, 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=800', 'Sustainable power.', 'Eco-friendly and powerful.', '{"Display": "6.1-inch"}', '["Gen 2 Chip", "Recycled material"]'),
('Galaxy S23+', 'Samsung', 'smartphones', 65900.00, 4.5, 900, NULL, 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=800', 'Large balanced.', 'Optimized for mobile gaming.', '{"Display": "6.6-inch"}', '["Gaming Performance", "Battery Life"]'),
('Galaxy S23 Ultra', 'Samsung', 'smartphones', 95900.00, 4.8, 1700, 'Best Seller', 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=800', '200MP Master.', 'Unmatched night photography.', '{"Display": "6.8-inch", "Camera": "200MP"}', '["200MP", "Astro Hyperlapse"]'),
('Galaxy S24', 'Samsung', 'smartphones', 69900.00, 4.6, 800, 'AI Ready', 'https://images.unsplash.com/photo-1707153123861-12c87c0a876a?w=800', 'Galaxy AI.', 'Search, translate, and edit with AI.', '{"Display": "6.2-inch"}', '["Circle to Search", "Live Translate"]'),
('Galaxy S24+', 'Samsung', 'smartphones', 79900.00, 4.6, 600, 'AI Ready', 'https://images.unsplash.com/photo-1707153123861-12c87c0a876a?w=800', 'Enhanced AI Canvas.', 'QHD+ display and AI features.', '{"Display": "6.7-inch"}', '["AI Editing", "QHD Display"]'),
('Galaxy S24 Ultra', 'Samsung', 'smartphones', 124900.00, 4.8, 1100, 'Premium', 'https://images.unsplash.com/photo-1707153123861-12c87c0a876a?w=800', 'Titanium and AI.', 'Titanium build meets Galaxy AI.', '{"Display": "6.8-inch", "Material": "Titanium"}', '["Galaxy AI", "Titanium Frame"]'),
('Galaxy S25', 'Samsung', 'smartphones', 74900.00, 4.7, 400, 'New', 'https://images.unsplash.com/photo-1707153123861-12c87c0a876a?w=800', 'Next Gen Standard.', 'Redefining the Galaxy experience.', '{"Display": "6.2-inch"}', '["Advanced AI", "3nm Chip"]'),
('Galaxy S25+', 'Samsung', 'smartphones', 84900.00, 4.7, 300, 'New', 'https://images.unsplash.com/photo-1707153123861-12c87c0a876a?w=800', 'Superior Performance.', 'High canvas for AI and gaming.', '{"Display": "6.7-inch"}', '["Pro AI", "Liquid Cooling"]'),
('Galaxy S25 Ultra', 'Samsung', 'smartphones', 134900.00, 4.9, 500, 'Premium', 'https://images.unsplash.com/photo-1707153123861-12c87c0a876a?w=800', 'Ultimate Ultra.', 'Peak mobile technology for 2025.', '{"Display": "6.9-inch"}', '["Ultimate AI", "Super Zoom"]'),
('Galaxy S26', 'Samsung', 'smartphones', 79900.00, 4.8, 150, 'Coming Soon', 'https://images.unsplash.com/photo-1707153123861-12c87c0a876a?w=800', 'Future Standard.', 'The next leap in mobile.', '{"Display": "6.3-inch"}', '["Quantum AI", "Satellite Link"]'),
('Galaxy S26+', 'Samsung', 'smartphones', 89900.00, 4.8, 100, 'Coming Soon', 'https://images.unsplash.com/photo-1707153123861-12c87c0a876a?w=800', 'Future Canvas.', 'Maximized speed and canvas.', '{"Display": "6.8-inch"}', '["Hyper Tasking", "OLED 3.0"]'),
('Galaxy S26 Ultra', 'Samsung', 'smartphones', 144900.00, 4.9, 80, 'Coming Soon', 'https://images.unsplash.com/photo-1707153123861-12c87c0a876a?w=800', 'Infinite Power.', 'The absolute limit of Galaxy series.', '{"Display": "7.0-inch"}', '["Infinite AI", "8K Raw"]'),
('Z Fold 3', 'Samsung', 'smartphones', 89900.00, 4.2, 500, NULL, 'https://images.unsplash.com/photo-1643485292440-2e404b868e82?w=800', 'Multitasking king.', 'First folding with S Pen support.', '{"Display": "7.6-inch folded"}', '["Foldable", "S Pen Support"]'),
('Z Fold 4', 'Samsung', 'smartphones', 109900.00, 4.4, 450, NULL, 'https://images.unsplash.com/photo-1643485292440-2e404b868e82?w=800', 'Slim foldable.', 'Thinner and more powerful.', '{"Display": "7.6-inch"}', '["Taskbar", "Pro Camera"]'),
('Z Fold 5', 'Samsung', 'smartphones', 139900.00, 4.6, 600, 'Prime', 'https://images.unsplash.com/photo-1643485292440-2e404b868e82?w=800', 'Zero Gap hinge.', 'Ultimate productivity in your pocket.', '{"Display": "7.6-inch"}', '["Zero Gap", "Snapdragon 8+"]'),
('Z Fold 6', 'Samsung', 'smartphones', 164900.00, 4.8, 400, 'Premium', 'https://images.unsplash.com/photo-1643485292440-2e404b868e82?w=800', 'AI Foldable.', 'The smartest large screen phone.', '{"Display": "7.6-inch"}', '["Galaxy AI", "Symmetry"]'),
('Z Fold 7', 'Samsung', 'smartphones', 174900.00, 4.9, 100, 'New', 'https://images.unsplash.com/photo-1643485292440-2e404b868e82?w=800', 'Thinner Canvas.', 'Next gen foldable evolution.', '{"Thickness": "9.9mm folded"}', '["Next Gen Hinge", "Pro AI"]'),
('Z Fold 8', 'Samsung', 'smartphones', 184900.00, 4.9, 50, 'Coming Soon', 'https://images.unsplash.com/photo-1643485292440-2e404b868e82?w=800', 'Future of Tablet-Phones.', 'The ultimate mobile canvas.', '{"Display": "8.0-inch"}', '["Ultra Pro AI", "Infinite Fold"]'),
('Z Flip 3', 'Samsung', 'smartphones', 54900.00, 4.3, 1200, NULL, 'https://images.unsplash.com/photo-1635391516089-ae1e7939a31a?w=800', 'Fashionable Flip.', 'The phone that defines style.', '{"Display": "6.7-inch"}', '["Compact", "Water Resistant"]'),
('Z Flip 4', 'Samsung', 'smartphones', 64900.00, 4.4, 1000, NULL, 'https://images.unsplash.com/photo-1635391516089-ae1e7939a31a?w=800', 'Better core flip.', 'Improved battery and nightography.', '{"Display": "6.7-inch"}', '["Flex Mode", "All day battery"]'),
('Z Flip 5', 'Samsung', 'smartphones', 84900.00, 4.6, 900, 'Prime', 'https://images.unsplash.com/photo-1635391516089-ae1e7939a31a?w=800', 'Flex Window.', 'Large cover display for easy access.', '{"Cover Display": "3.4-inch"}', '["Flex Window", "Compact Power"]'),
('Z Flip 6', 'Samsung', 'smartphones', 94900.00, 4.7, 600, 'New', 'https://images.unsplash.com/photo-1635391516089-ae1e7939a31a?w=800', 'AI Flip.', 'Pro-grade camera on a flip.', '{"Display": "6.7-inch", "Camera": "50MP"}', '["Galaxy AI", "Vapor Chamber"]'),
('Z Flip 7', 'Samsung', 'smartphones', 104900.00, 4.8, 150, 'Coming Soon', 'https://images.unsplash.com/photo-1635391516089-ae1e7939a31a?w=800', 'Sleeker Flip.', 'Evolved style and speed.', '{"Display": "6.7-inch"}', '["AI Flex", "Ultra Sleek"]'),
('Z Flip 8', 'Samsung', 'smartphones', 114900.00, 4.9, 50, 'Coming Soon', 'https://images.unsplash.com/photo-1635391516089-ae1e7939a31a?w=800', 'Future Icon.', 'The ultimate compact flagship.', '{"Display": "6.8-inch"}', '["Next Gen AI", "Pro Flip"]'),
('Galaxy A15', 'Samsung', 'smartphones', 15900.00, 4.2, 2500, 'Value', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Super AMOLED.', 'Affordable quality.', '{"Display": "6.5-inch"}', '["AMOLED", "50MP"]'),
('Galaxy A17', 'Samsung', 'smartphones', 18900.00, 4.3, 1200, 'New', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Balanced A-series.', 'The new standard of value.', '{"Display": "6.6-inch"}', '["Stable Power", "Triple Cam"]'),
('Galaxy A57', 'Samsung', 'smartphones', 24900.00, 4.4, 800, 'New', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Premium Midrange.', 'A-series with Pro traits.', '{"Display": "6.7-inch", "Refresh": "120Hz"}', '["OIS Camera", "Waterproof"]'),

-- Google
('Pixel 5', 'Google', 'smartphones', 25900.00, 4.4, 1500, NULL, 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Compact Google.', 'Pure Android experience.', '{"Display": "6.0-inch"}', '["Wireless Char", "Compact"]'),
('Pixel 5a', 'Google', 'smartphones', 22900.00, 4.4, 1100, NULL, 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Battery king.', 'Day-plus battery life.', '{"Display": "6.3-inch"}', '["IP67", "Headphone Jack"]'),
('Pixel 6', 'Google', 'smartphones', 32900.00, 4.3, 2000, NULL, 'https://images.unsplash.com/photo-1635391516089-ae1e7939a31a?w=800', 'Tensor debut.', 'First Google chip smartphone.', '{"Display": "6.4-inch"}', '["Tensor", "Magic Eraser"]'),
('Pixel 6 Pro', 'Google', 'smartphones', 42900.00, 4.4, 1600, NULL, 'https://images.unsplash.com/photo-1635391516089-ae1e7939a31a?w=800', 'Pro Tensor.', 'Advanced telephoto Pixel.', '{"Display": "6.7-inch"}', '["Telephoto", "120Hz"]'),
('Pixel 6a', 'Google', 'smartphones', 28900.00, 4.5, 2500, 'Value', 'https://images.unsplash.com/photo-1635391516089-ae1e7939a31a?w=800', 'Compact AI.', 'Pixel power at a lower cost.', '{"Display": "6.1-inch"}', '["Tensor", "Pixel Camera"]'),
('Pixel 7', 'Google', 'smartphones', 39900.00, 4.5, 1800, NULL, 'https://images.unsplash.com/photo-1681283620358-006f1577a3d3?w=800', 'Cinematic Pixel.', 'Everything you need in a phone.', '{"Display": "6.3-inch"}', '["Tensor G2", "Face Unlock"]'),
('Pixel 7 Pro', 'Google', 'smartphones', 49900.00, 4.6, 1400, 'Prime', 'https://images.unsplash.com/photo-1681283620358-006f1577a3d3?w=800', 'Ultimate Photo.', 'Google-powered photography masterpiece.', '{"Display": "6.7-inch"}', '["Macro Focus", "Super Zoom"]'),
('Pixel 7a', 'Google', 'smartphones', 32900.00, 4.6, 2200, 'Value', 'https://images.unsplash.com/photo-1681283620358-006f1577a3d3?w=800', 'High refresh A.', 'The A-series that feels like a Pro.', '{"Display": "6.1-inch", "Refresh": "90Hz"}', '["Wireless Char", "VPN"]'),
('Pixel 8', 'Google', 'smartphones', 59900.00, 4.6, 1200, NULL, 'https://images.unsplash.com/photo-1697200779774-7225b2931a29?w=800', 'AI Center.', 'Tensor G3 and advanced AI.', '{"Display": "6.2-inch"}', '["Best Take", "Audio Eraser"]'),
('Pixel 8 Pro', 'Google', 'smartphones', 75900.00, 4.7, 1000, 'Premium', 'https://images.unsplash.com/photo-1697200779774-7225b2931a29?w=800', 'Generative AI.', 'The smartest Pixel yet.', '{"Display": "6.7-inch"}', '["Video Boost", "Night Sight"]'),
('Pixel 8a', 'Google', 'smartphones', 45900.00, 4.6, 800, 'Value', 'https://images.unsplash.com/photo-1697200779774-7225b2931a29?w=800', 'Powerful Value.', 'Advanced AI at an amazing price.', '{"Display": "6.1-inch"}', '["Tensor G3", "Gemini Nano"]'),
('Pixel 9', 'Google', 'smartphones', 79900.00, 4.7, 500, 'New', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'Reimagined Pixel.', 'New design and more AI.', '{"Display": "6.3-inch"}', '["Gemini AI", "Satellite SOS"]'),
('Pixel 9 Pro', 'Google', 'smartphones', 109900.00, 4.8, 300, 'Premium', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'Pro Power.', 'Advanced AI integrated in every corner.', '{"Display": "6.3-inch"}', '["Gemini Pro", "Thermometer"]'),
('Pixel 9 Pro XL', 'Google', 'smartphones', 124900.00, 4.8, 250, 'Premium', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'Large Canvas.', 'Google intelligence on a large display.', '{"Display": "6.8-inch"}', '["AI Editing", "Pure Android"]'),
('Pixel 10', 'Google', 'smartphones', 89900.00, 4.8, 100, 'Coming Soon', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'Decade of Pixel.', 'The future of mobile interaction.', '{"Display": "6.4-inch"}', '["Quantum AI", "Satellite Pro"]'),
('Pixel 10 Pro', 'Google', 'smartphones', 119900.00, 4.9, 80, 'Coming Soon', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'Future Pro.', 'Redefining artificial intelligence in mobile.', '{"Display": "6.4-inch"}', '["Tensor G5", "Ultra AI"]'),
('Pixel 10 Pro XL', 'Google', 'smartphones', 134900.00, 4.9, 60, 'Coming Soon', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'Infinite Brain.', 'The peak of Google software and hardware.', '{"Display": "6.9-inch"}', '["Google Brain", "Infinite AI"]'),
('Pixel 10a', 'Google', 'smartphones', 49900.00, 4.7, 40, 'Coming Soon', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'AI Value.', 'Essential intelligence made accessible.', '{"Display": "6.1-inch"}', '["Essential AI", "7 year updates"]'),
('Pixel 11 Series', 'Google', 'smartphones', 109900.00, 4.9, 10, 'Coming Soon', 'https://images.unsplash.com/photo-1647412856407-a363d30b910e?w=800', 'Beyond Pixel.', 'The next frontier of Google mobile.', '{"Display": "Adaptive"}', '["Neuro Chip", "Space Link"]'),

-- Additional Samsung A & Z Series
('Galaxy A17', 'Samsung', 'smartphones', 18900.00, 4.3, 1200, 'New', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Balanced A-series.', 'The new standard of value.', '{"Display": "6.6-inch"}', '["Stable Power", "Triple Cam"]'),
('Galaxy A57', 'Samsung', 'smartphones', 24900.00, 4.4, 800, 'New', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Premium Midrange.', 'A-series with Pro traits.', '{"Display": "6.7-inch", "Refresh": "120Hz"}', '["OIS Camera", "Waterproof"]'),

-- Xiaomi Continued
('Xiaomi 13', 'Xiaomi', 'smartphones', 45900.00, 4.5, 900, NULL, 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Leica optics.', 'Authentic Leica imagery.', '{"Display": "6.36-inch", "Lens": "Leica"}', '["Leica Optic", "OLED"]'),
('Xiaomi 14', 'Xiaomi', 'smartphones', 69900.00, 4.7, 600, 'New', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Optical Breakthrough.', 'Leica Summilux lens.', '{"Display": "6.36-inch"}', '["Next Gen Leica", "HyperOS"]'),
('Xiaomi 15', 'Xiaomi', 'smartphones', 79900.00, 4.8, 300, 'New', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Advanced HyperOS.', 'The future of Xiaomi mobile.', '{"Display": "6.4-inch"}', '["Titanium Core", "Advanced AI"]'),
('Xiaomi 16', 'Xiaomi', 'smartphones', 85900.00, 4.8, 100, 'Coming Soon', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Future Performance.', 'Next-gen Xiaomi core.', '{"Display": "6.5-inch"}', '["Hyper Speed", "Liquid Cool"]'),
('Xiaomi 17', 'Xiaomi', 'smartphones', 95900.00, 4.9, 50, 'Coming Soon', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Ultimate Core.', 'Peak Xiaomi technology.', '{"Display": "6.6-inch"}', '["Infinite AI", "Pro Vision"]'),
('Redmi K40', 'Xiaomi', 'smartphones', 22900.00, 4.4, 3000, 'Value', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Budget King.', 'The original budget flagship.', '{"Display": "6.67-inch"}', '["E4 AMOLED", "Snapdragon 870"]'),
('Redmi K50', 'Xiaomi', 'smartphones', 26900.00, 4.5, 2500, NULL, 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Speed Redefined.', 'Super fast and super reliable.', '{"Display": "6.67-inch"}', '["2K Screen", "Fast Charge"]'),
('Redmi K60', 'Xiaomi', 'smartphones', 32900.00, 4.6, 1800, NULL, 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Performance King.', 'Unmatched power in its class.', '{"Display": "6.67-inch"}', '["Wireless Charge", "QHD"]'),
('Redmi K70', 'Xiaomi', 'smartphones', 38900.00, 4.7, 1200, 'Best Seller', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Midrange Master.', 'Premium features for everyone.', '{"Display": "6.67-inch"}', '["Metal Frame", "HyperOS"]'),
('Redmi K80', 'Xiaomi', 'smartphones', 44900.00, 4.8, 600, 'New', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Ultra Speed.', 'Next-gen Redmi performance.', '{"Display": "6.7-inch"}', '["Advanced AI", "Super Charge"]'),

-- OnePlus Continued
('OnePlus 8T', 'OnePlus', 'smartphones', 32900.00, 4.4, 1800, NULL, 'https://images.unsplash.com/photo-1706173299723-57bfb3469854?w=800', 'Ultra Fast.', 'Refined speed and style.', '{"Display": "6.55-inch", "Refresh": "120Hz"}', '["65W Charge", "120Hz"]'),
('OnePlus 9', 'OnePlus', 'smartphones', 38900.00, 4.4, 1600, NULL, 'https://images.unsplash.com/photo-1706173299723-57bfb3469854?w=800', 'Hasselblad Color.', 'Natural color calibration.', '{"Display": "6.55-inch", "Camera": "Hasselblad"}', '["Hasselblad", "Fluid Display"]'),
('OnePlus 9 Pro', 'OnePlus', 'smartphones', 48900.00, 4.5, 1200, NULL, 'https://images.unsplash.com/photo-1706173299723-57bfb3469854?w=800', 'Pro Speed.', 'Ultra premium OnePlus experience.', '{"Display": "6.7-inch"}', '["QHD+", "Smart 120Hz"]'),
('OnePlus 10 Pro', 'OnePlus', 'smartphones', 54900.00, 4.5, 1000, NULL, 'https://images.unsplash.com/photo-1706173299723-57bfb3469854?w=800', 'Capture Every Spec.', 'Second gen Hasselblad camera.', '{"Display": "6.7-inch"}', '["10-bit Color", "80W Charge"]'),
('OnePlus 11', 'OnePlus', 'smartphones', 59900.00, 4.6, 900, 'Best Seller', 'https://images.unsplash.com/photo-1706173299723-57bfb3469854?w=800', 'The Shape of Power.', 'Unmatched flagship performance.', '{"Display": "6.7-inch"}', '["Dual Calibration", "Bionic Motor"]'),
('OnePlus 13T', 'OnePlus', 'smartphones', 68900.00, 4.8, 200, 'New', 'https://images.unsplash.com/photo-1706173299723-57bfb3469854?w=800', 'Speed Refined.', 'The ultimate T-series experience.', '{"Display": "6.75-inch"}', '["Fastest Charge", "Pro AI"]'),
('Ace 3', 'OnePlus', 'smartphones', 32900.00, 4.5, 500, 'Value', 'https://images.unsplash.com/photo-1706173299723-57bfb3469854?w=800', 'Performance Ace.', 'High performance flagship.', '{"Display": "6.7-inch"}', '["Liquid Cooling", "100W Charge"]'),

-- Oppo Continued
('Find X3', 'Oppo', 'smartphones', 38900.00, 4.4, 800, NULL, 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'Billion Color.', 'Stunning photography and display.', '{"Display": "6.7-inch"}', '["Billion Color", "Microscopic"]'),
('Find X5', 'Oppo', 'smartphones', 48900.00, 4.5, 700, NULL, 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'Pure Design.', 'Hasselblad camera for mobile.', '{"Display": "6.55-inch"}', '["Hasselblad", "MariSilicon"]'),
('Find X6', 'Oppo', 'smartphones', 58900.00, 4.6, 600, NULL, 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'Periscope Master.', 'Advanced telephoto imaging.', '{"Display": "6.74-inch"}', '["1-inch Sensor", "Pro Vision"]'),
('Find X7', 'Oppo', 'smartphones', 68900.00, 4.7, 500, 'Prime', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'Optical Perfection.', 'Next gen imaging technology.', '{"Display": "6.78-inch"}', '["Dual Periscope", "Color Master"]'),
('Find X8', 'Oppo', 'smartphones', 78900.00, 4.8, 300, 'New', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'AI Master.', 'The smartest Find X yet.', '{"Display": "6.8-inch"}', '["AI Editing", "Pure Imaging"]'),
('Find X9', 'Oppo', 'smartphones', 88900.00, 4.9, 100, 'Coming Soon', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'Future of Find.', 'Redefining the premium experience.', '{"Display": "6.9-inch"}', '["Hyper Speed", "Satellite SOS"]'),
('Find X9 Pro', 'Oppo', 'smartphones', 108900.00, 4.9, 50, 'Coming Soon', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'Ultimate Pro.', 'Absolute peak of Oppo innovation.', '{"Display": "7.0-inch"}', '["Infinite AI", "Pro Max Zoom"]'),

-- Vivo Continued
('X60', 'Vivo', 'smartphones', 28900.00, 4.3, 1200, NULL, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Zeiss Vision.', 'Professional photography with Zeiss optics.', '{"Display": "6.56-inch"}', '["Zeiss", "Slim Design"]'),
('X70', 'Vivo', 'smartphones', 38900.00, 4.4, 1000, NULL, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Photography Evolution.', 'Enhanced gimbal stabilization.', '{"Display": "6.56-inch"}', '["Gimbal 3.0", "T* Coating"]'),
('X80', 'Vivo', 'smartphones', 48900.00, 4.5, 900, NULL, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Cinematic Pro.', 'Cinematic video and imaging.', '{"Display": "6.78-inch"}', '["V1 Chip", "Zeiss Movie"]'),
('X90', 'Vivo', 'smartphones', 58900.00, 4.6, 800, 'Prime', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', '1-inch Sensation.', 'Unmatched low light performance.', '{"Display": "6.78-inch"}', '["1-inch Sensor", "V2 Chip"]'),
('X100', 'Vivo', 'smartphones', 68900.00, 4.7, 600, 'Best Seller', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Apo Telephoto.', 'Professional grade telephoto imaging.', '{"Display": "6.78-inch"}', '["Zeiss APO", "V3 Chip"]'),
('X200', 'Vivo', 'smartphones', 78900.00, 4.8, 300, 'New', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Next Gen Zeiss.', 'The future of mobile photography.', '{"Display": "6.8-inch"}', '["V4 Chip", "AI Master"]'),
('X300', 'Vivo', 'smartphones', 88900.00, 4.9, 100, 'Coming Soon', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Ultimate Imaging.', 'Beyond professional photography.', '{"Display": "6.9-inch"}', '["Infinite Optic", "AI Pro"]'),
('iQOO 9', 'Vivo', 'smartphones', 35900.00, 4.6, 1200, 'Gaming', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Speed unleashed.', 'High performance gaming machine.', '{"Display": "6.56-inch"}', '["Pressure Sense", "V1+"]'),
('iQOO 11', 'Vivo', 'smartphones', 45900.00, 4.7, 800, 'Gaming', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'E6 AMOLED.', 'Stunning display for gaming.', '{"Display": "6.78-inch"}', '["E6 AMOLED", "V2 Chip"]'),
('iQOO 13', 'Vivo', 'smartphones', 55900.00, 4.8, 500, 'New', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Bionic Power.', 'Extreme gaming with AI.', '{"Display": "6.8-inch"}', '["Snapdragon 8 Gen 4", "Hyper Gaming"]'),
('Neo10 Pro+', 'Vivo', 'smartphones', 39900.00, 4.7, 400, 'Value', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Performance Value.', 'Pro performance at a Neo cost.', '{"Display": "6.7-inch"}', '["Liquid Cool", "Fast Charge"]'),

-- Honor Continued
('Magic 8', 'Honor', 'smartphones', 85900.00, 4.9, 100, 'Coming Soon', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'Infinite Magic.', 'Beyond the horizon of mobile tech.', '{"Display": "6.85-inch"}', '["Infinite AI", "Quantum Power"]'),
('Magic 8 Pro', 'Honor', 'smartphones', 99900.00, 4.9, 50, 'Coming Soon', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'Peak Magic.', 'The absolute ultimate Honor experience.', '{"Display": "6.9-inch"}', '["Neuro Pro", "Titanium Magic"]'),
('Magic V4', 'Honor', 'smartphones', 134900.00, 4.8, 100, 'Coming Soon', 'https://images.unsplash.com/photo-1643485292440-2e404b868e82?w=800', 'Thin Future.', 'Next gen thin foldable.', '{"Thickness": "9.0mm"}', '["Ultra Thin", "V-Hinge"]'),
('Magic V5', 'Honor', 'smartphones', 144900.00, 4.9, 50, 'Coming Soon', 'https://images.unsplash.com/photo-1643485292440-2e404b868e82?w=800', 'Modular Fold.', 'Future of modular foldable design.', '{"System": "Modular"}', '["Pro Fold", "AI Hinge"]'),
('Magic V6', 'Honor', 'smartphones', 154900.00, 4.9, 20, 'Coming Soon', 'https://images.unsplash.com/photo-1643485292440-2e404b868e82?w=800', 'Infinite Fold.', 'Redefining the foldable limits.', '{"Display": "8.2-inch"}', '["Infinite Canvas", "Pro AI"]'),
('Honor Win', 'Honor', 'smartphones', 45900.00, 4.6, 300, 'New', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'Total Victory.', 'Balanced performance and gaming style.', '{"Display": "6.7-inch"}', '["Win Mode", "Hyper Speed"]'),
('GT Pro', 'Honor', 'smartphones', 55900.00, 4.8, 200, 'New', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'Racing Performance.', 'The fastest flagship for the young.', '{"Display": "144Hz"}', '["GT Engine", "Racing Style"]'),

-- Additional Samsung Variants
('Galaxy S21 Ultra', 'Samsung', 'smartphones', 65900.00, 4.6, 1600, 'Premium', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Epic in every way.', 'Original S Pen support for S series.', '{"Display": "6.8-inch"}', '["S Pen Sync", "108MP"]'),
('Galaxy S25 Ultra', 'Samsung', 'smartphones', 134900.00, 4.9, 500, 'Premium', 'https://images.unsplash.com/photo-1707153123861-12c87c0a876a?w=800', 'Ultimate Ultra.', 'Peak mobile technology for 2025.', '{"Display": "6.9-inch"}', '["Ultimate AI", "Super Zoom"]'),

-- Additional Solar Systems
('5 kW Standard Plus', 'BrandMart Solar', 'solar-systems', 620000.00, 4.8, 40, 'Popular', 'https://images.unsplash.com/photo-1509391366360-fe5bb6058826?w=800', 'Standard Plus Energy.', 'Enhanced system with higher efficiency panels.', '{"kW": "5"}', '["Pro Panels", "Smart Meter"]'),
('10 kW Home System Premium+', 'BrandMart Solar', 'solar-systems', 1450000.00, 4.9, 25, 'Premium', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800', 'Ultimate Home Energy.', 'Total energy independence with advanced analytics.', '{"kW": "10"}', '["Full Smart Control", "Max Cycles"]'),

-- Motorola Continued
('Razr 40', 'Motorola', 'smartphones', 44900.00, 4.2, 1200, 'Value', 'https://images.unsplash.com/photo-1635391516089-ae1e7939a31a?w=800', 'Flip for everyone.', 'Accessible foldable experience.', '{"Display": "6.9-inch"}', '["Foldable", "Compact"]'),
('Razr 50', 'Motorola', 'smartphones', 64900.00, 4.5, 800, 'New', 'https://images.unsplash.com/photo-1635391516089-ae1e7939a31a?w=800', 'Evolved Razr.', 'Smarter and faster flip phone.', '{"Display": "6.9-inch"}', '["Large Cover", "IPX8"]'),
('Moto G24', 'Motorola', 'smartphones', 12900.00, 4.1, 3000, 'Value', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Pure G.', 'Reliable everyday performance.', '{"Display": "6.6-inch"}', '["Stereo Speakers", "Fast Charge"]'),
('Moto G04', 'Motorola', 'smartphones', 9900.00, 4.0, 5000, 'Best Value', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Essential Moto.', 'All your essentials in one phone.', '{"Display": "6.6-inch"}', '["Budget", "Long Battery"]'),

-- Nothing Continued
('Nothing Phone 1', 'Nothing', 'smartphones', 25900.00, 4.3, 3500, 'Iconic', 'https://images.unsplash.com/photo-1695048133142-1a20484d2509?w=800', 'Glyph debut.', 'The phone that made lights cool.', '{"Display": "6.55-inch"}', '["Glyph", "Nothing OS"]'),
('Nothing Phone 2', 'Nothing', 'smartphones', 38900.00, 4.6, 2500, 'Prime', 'https://images.unsplash.com/photo-1695048133142-1a20484d2509?w=800', 'Powerful Glyph.', 'Wait for nothing and everyone.', '{"Display": "6.7-inch"}', '["Gen 2 Glyph", "Performance"]'),
('Nothing Phone 4a', 'Nothing', 'smartphones', 22900.00, 4.5, 1200, 'Value', 'https://images.unsplash.com/photo-1695048133142-1a20484d2509?w=800', 'Essential Nothing.', 'The essential Nothing experience.', '{"Display": "6.5-inch"}', '["Value Glyph", "Nothing OS"]'),

-- ZTE/Nubia Continued
('Nubia Z50', 'ZTE/Nubia', 'smartphones', 42900.00, 4.4, 600, NULL, 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', '35mm Legend.', 'Photography centric performance.', '{"Display": "6.67-inch"}', '["35mm Lens", "Snapdragon 8 Gen 2"]'),
('Nubia Z60', 'ZTE/Nubia', 'smartphones', 52900.00, 4.6, 500, NULL, 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Under Display Pro.', 'Perfect full screen experience.', '{"Display": "UDC"}', '["Under Camera", "Starry Sky"]'),
('Nubia Z70 Ultra', 'ZTE/Nubia', 'smartphones', 72900.00, 4.8, 300, 'Premium', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Imaging Beast.', 'Advanced optical performance.', '{"Display": "6.8-inch"}', '["Triple UDC", "Pro Optic"]'),
('Nubia Z70S Ultra', 'ZTE/Nubia', 'smartphones', 78900.00, 4.8, 200, 'New', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Speed & Imaging.', 'The fastest Nubia ever.', '{"Display": "Hyper Display"}', '["Hyper Speed", "Pro Optical"]'),

-- Additional Solar Components
('IQ Series Microinverters', 'Enphase Energy', 'solar-inverters', 18500.00, 4.9, 1200, 'Best Micro', 'https://images.unsplash.com/photo-1509391366360-fe5bb6058826?w=800', 'Reliable Micros.', 'Maximum energy from every panel.', '{"Type": "Micro"}', '["Safety", "Monitoring"]'),
('Growatt 10kW Inverter', 'Growatt', 'solar-inverters', 85000.00, 4.4, 450, 'Budget', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800', 'Affordable Home Solar.', 'Solid performance at a budget cost.', '{"kW": "10"}', '["Affordable", "Easy Install"]'),
('GoodWe 10kW Hybrid', 'GoodWe', 'solar-inverters', 95000.00, 4.5, 380, NULL, 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800', 'Hybrid GoodWe.', 'Ready for your energy storage future.', '{"Type": "Hybrid"}', '["Compact", "Smart"]'),
('Solis 10kW Inverter', 'Ginlong Solis', 'solar-inverters', 105000.00, 4.5, 300, NULL, 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800', 'High Yield Solis.', 'Reliable string inverter for your home.', '{"Efficiency": "98%"}', '["Stable", "Dual MPPT"]'),

('Pylontech US3000C', 'Pylontech', 'solar-batteries', 185000.00, 4.7, 500, 'Modular', 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800', 'Classic LFP Storage.', 'Modular and high cycle battery.', '{"Capacity": "3.5kWh"}', '["Modular", "Safe LFP"]'),
('Dyness 10kWh Stack', 'Dyness', 'solar-batteries', 485000.00, 4.6, 320, NULL, 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800', 'Stackable Power.', 'Easy to install energy storage.', '{"kW": "10"}', '["Stackable", "BMS Included"]'),
('Victron LFP 12V 200Ah', 'Victron Energy', 'solar-batteries', 125000.00, 4.9, 150, 'Marine Grade', 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800', 'Toughest Battery.', 'Professional grade off-grid power.', '{"Type": "LiFePO4"}', '["Bluetooth", "Ultra Reliable"]'),

-- Complete Systems Level 2
('20kW Commercial Advanced', 'BrandMart Solar', 'solar-systems', 4500000.00, 4.9, 30, 'Enterprise', 'https://images.unsplash.com/photo-1509391366360-fe5bb6058826?w=800', 'Advanced Commercial Energy.', 'Full independence for large operations.', '{"kW": "20"}', '["Advanced Control", "Max Warranty"]'),

-- Xiaomi
('Xiaomi 12', 'Xiaomi', 'smartphones', 32900.00, 4.3, 1200, NULL, 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Compact flagship.', 'Master every scene.', '{"Display": "6.28-inch"}', '["Fast Charge", "Harman Kardon"]'),
('Xiaomi 13', 'Xiaomi', 'smartphones', 45900.00, 4.5, 900, NULL, 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Leica optics.', 'Authentic Leica imagery.', '{"Display": "6.36-inch", "Lens": "Leica"}', '["Leica Optic", "OLED"]'),
('Xiaomi 14', 'Xiaomi', 'smartphones', 69900.00, 4.7, 600, 'New', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Optical Breakthrough.', 'Leica Summilux lens.', '{"Display": "6.36-inch"}', '["Next Gen Leica", "HyperOS"]'),
('Xiaomi 15', 'Xiaomi', 'smartphones', 79900.00, 4.8, 300, 'New', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Advanced HyperOS.', 'The future of Xiaomi mobile.', '{"Display": "6.4-inch"}', '["Titanium Core", "Advanced AI"]'),
('Xiaomi 16 Ultra', 'Xiaomi', 'smartphones', 99900.00, 4.9, 150, 'Premium', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Photography King.', 'Unmatched imaging performance.', '{"Display": "6.7-inch", "Sensor": "1-inch"}', '["Leica Pro", "120W Charge"]'),
('Xiaomi 17 Ultra', 'Xiaomi', 'smartphones', 119900.00, 4.9, 50, 'Coming Soon', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Image Master.', 'Redefining photography once again.', '{"Display": "6.8-inch"}', '["Infinite Zoom", "Pro Imaging"]'),
('Redmi K40', 'Xiaomi', 'smartphones', 22900.00, 4.4, 3000, 'Value', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Budget King.', 'The original budget flagship.', '{"Display": "6.67-inch"}', '["E4 AMOLED", "Snapdragon 870"]'),
('Redmi K90ProMax', 'Xiaomi', 'smartphones', 49900.00, 4.7, 100, 'Premium', 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=800', 'Redmi Peak.', 'Highest performance for a Redmi.', '{"Display": "6.7-inch"}', '["Max Speed", "200MP"]'),

-- OnePlus
('OnePlus 8', 'OnePlus', 'smartphones', 28900.00, 4.3, 1500, NULL, 'https://images.unsplash.com/photo-1706173299723-57bfb3469854?w=800', 'Lead with Speed.', 'The classic OnePlus experience.', '{"Display": "6.55-inch"}', '["90Hz", "Fluid Display"]'),
('OnePlus 12', 'OnePlus', 'smartphones', 64900.00, 4.7, 800, 'Best Seller', 'https://images.unsplash.com/photo-1706173299723-57bfb3469854?w=800', 'Smooth Beyond Belief.', '4th gen Hasselblad camera.', '{"Display": "6.82-inch", "Chip": "Snapdragon 8 Gen 3"}', '["Hasselblad", "Fast Wireless"]'),
('OnePlus 13', 'OnePlus', 'smartphones', 74900.00, 4.8, 400, 'New', 'https://images.unsplash.com/photo-1706173299723-57bfb3469854?w=800', 'Era of Speed.', 'Extreme performance with refined style.', '{"Display": "6.8-inch"}', '["Next Gen Hasselblad", "Hyper Charge"]'),
('OnePlus 15', 'OnePlus', 'smartphones', 89900.00, 4.9, 50, 'Coming Soon', 'https://images.unsplash.com/photo-1706173299723-57bfb3469854?w=800', 'Peak OnePlus.', 'The absolute limit of speed.', '{"Display": "6.9-inch"}', '["Titanium Speed", "Ultra Oxygen"]'),
('Ace 6', 'OnePlus', 'smartphones', 38900.00, 4.5, 300, 'New', 'https://images.unsplash.com/photo-1706173299723-57bfb3469854?w=800', 'Performance Ace.', 'High performance centric flagship.', '{"Display": "6.7-inch"}', '["Liquid Cooling", "Gaming Mode"]'),

-- Oppo / Vivo
('Find X8 Ultra', 'Oppo', 'smartphones', 95900.00, 4.9, 100, 'Premium', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'Photography King.', 'Master of imaging and style.', '{"Display": "6.8-inch"}', '["Hasselblad Lens", "Ultra Thin"]'),
('Vivo X200 Ultra', 'Vivo', 'smartphones', 99900.00, 4.9, 80, 'Premium', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Imaging Master.', 'Zeiss co-engineered optical perfection.', '{"Display": "6.8-inch"}', '["Zeiss Optic", "Pro Stage AI"]'),
('iQOO 15', 'Vivo', 'smartphones', 52900.00, 4.8, 150, 'New', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Gaming Beast.', 'The ultimate mobile gaming machine.', '{"Display": "6.7-inch"}', '["Snapdragon 8 Gen 4", "Hyper Gaming"]'),

-- Motorola / Nothing
('Razr 70 Ultra', 'Motorola', 'smartphones', 94900.00, 4.8, 200, 'New', 'https://images.unsplash.com/photo-1635391516089-ae1e7939a31a?w=800', 'Iconic Fold.', 'Larger canvas, smarter flip.', '{"Display": "6.9-inch"}', '["Large Cover", "Sleek"]'),
('Nothing Phone 3', 'Nothing', 'smartphones', 45900.00, 4.7, 500, 'New', 'https://images.unsplash.com/photo-1695048133142-1a20484d2509?w=800', 'AI Symphony.', 'The smartest Glyph interface ever.', '{"Display": "6.7-inch"}', '["Glyph 2.0", "Nothing AI"]'),
('Nubia Z80 Ultra', 'ZTE/Nubia', 'smartphones', 85900.00, 4.9, 100, 'New', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', 'Under-display Pro.', 'Perfect screen, perfect performance.', '{"Display": "Under Display"}', '["Under Camera", "Star Lens"]'),

-- 2. AC'S
('Infinity® Series', 'Carrier', 'air-conditioners', 55000.00, 4.8, 420, 'Premium', 'https://images.unsplash.com/photo-1631541909061-70e736829705?w=800', 'Quietest Carrier cooling.', 'The quietest and most efficient cooling system.', '{"Capacity": "1.5 Tons", "SEER": "26"}', '["Variable Speed", "Ultra Quiet"]'),
('Fit & VRV Life® Systems', 'Daikin', 'air-conditioners', 62000.00, 4.7, 350, NULL, 'https://images.unsplash.com/photo-1599939575322-792a3172ec3e?w=800', 'Variable flow tech.', 'Premium Daikin technology for your home.', '{"Tech": "VRV"}', '["Energy Efficient", "Compact"]'),
('XV20i Series', 'Trane', 'air-conditioners', 78900.00, 4.9, 120, 'Top Rated', 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=800', 'Precision cooling.', 'Maintains comfort within 1/2 degree.', '{"Type": "Variable Speed"}', '["Precision", "Reliable"]'),
('M-Series & Mr. Slim', 'Mitsubishi Electric', 'air-conditioners', 48900.00, 4.8, 280, NULL, 'https://images.unsplash.com/photo-1631541909061-70e736829705?w=800', 'Zoned comfort.', 'Premium ductless and ducted solutions.', '{"System": "Zoned"}', '["Quiet", "Efficient"]'),
('Dave Lennox Signature®', 'Lennox', 'air-conditioners', 85000.00, 4.9, 90, 'Premium', 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=800', 'Peak Performance.', 'Highest quality home cooling.', '{"Efficiency": "SEER 28"}', '["Ultra Silent", "Pure Air"]'),
('Set Free VRF Series', 'Hitachi', 'air-conditioners', 72000.00, 4.7, 110, NULL, 'https://images.unsplash.com/photo-1599939575322-792a3172ec3e?w=800', 'Commercial Grade Home.', 'Variable refrigerant flow for large homes.', '{"System": "VRF"}', '["Multi-Zone", "Powerful"]'),
('Endeavor™ Line', 'Rheem', 'air-conditioners', 52500.00, 4.6, 200, NULL, 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=800', 'Dependable Rheem.', 'Efficiency you can count on.', '{"SEER": "20"}', '["Durable", "Smart Control"]'),

-- 3. WASHING MACHINES
('LG WT8405CW', 'LG', 'washing-machines', 35900.00, 4.5, 400, NULL, 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800', 'Top Load Power.', 'TurboWash technology.', '{"Capacity": "5.2 cu ft"}', '["TurboWash", "Smart Wi-Fi"]'),
('LG Front Load HE', 'LG', 'washing-machines', 48900.00, 4.7, 550, 'Best Seller', 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=800', 'Efficiency First.', 'Professional cleaning at home.', '{"Type": "Front Load"}', '["HE Rated", "Steam Clean"]'),
('Speed Queen TR7003WN', 'Speed Queen', 'washing-machines', 115000.00, 4.9, 100, 'Commercial', 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800', 'Indestructible.', 'Built for a lifetime of use.', '{"Warranty": "7 Years"}', '["Stainless Steel", "Industrial Build"]'),
('GE Profile PTW800BPWRS', 'GE Profile', 'washing-machines', 58900.00, 4.8, 140, 'New', 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800', 'Smart Wash.', 'Advanced fabric care and AI cycles.', '{"AI": "Ready"}', '["Smart Dispense", "Microban"]'),
('Whirlpool WTW8127LC', 'Whirlpool', 'washing-machines', 38900.00, 4.6, 320, NULL, 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800', 'Reliable Whirlpool.', 'Classic cleaning power.', '{"Capacity": "5.3 cu ft"}', '["Load & Go", "Pre-treat Station"]'),
('Maytag Pet Pro', 'Maytag', 'washing-machines', 45900.00, 4.7, 180, 'Specialty', 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800', 'Pet Hair Removal.', 'Targeted pet hair and stain removal.', '{"Feature": "Pet Filter"}', '["Pet Pro Cycle", "Heavy Duty"]'),
('Electrolux Front-Load', 'Electrolux', 'washing-machines', 52900.00, 4.6, 210, NULL, 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=800', 'LuxCare Dry.', 'Gentle on fabrics, tough on dirt.', '{"Tech": "LuxCare"}', '["Stain Treat", "Eco Friendly"]'),
('Bespoke AI All-in-One', 'Samsung', 'washing-machines', 79900.00, 4.8, 110, 'New', 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=800', 'Washer-Dryer Combo.', 'AI-powered all-in-one laundry center.', '{"System": "AI Combo"}', '["Aura Design", "AI Optimal Wash"]'),

-- 4. SOLAR SOLUTIONS (INVERTERS)
('Huawei SUN2000 10kW', 'Huawei', 'solar-inverters', 145000.00, 4.7, 150, 'Smart Choice', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800', 'Smart string inverter.', 'High yield and smart monitoring.', '{"kW": "10"}', '["Safety", "High Efficiency"]'),
('Sungrow 10kW Hybrid', 'Sungrow', 'solar-inverters', 115000.00, 4.6, 200, 'Best Value', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800', 'Versatile hybrid.', 'Ready for battery integration.', '{"Type": "Hybrid"}', '["Affordable", "Reliable"]'),
('SMA Sunny Boy 10kW', 'SMA', 'solar-inverters', 185000.00, 4.9, 90, 'German Quality', 'https://images.unsplash.com/photo-1611365892117-00ac5ef43759?w=800', 'German engineering.', 'Top tier reliability and performance.', '{"Country": "Germany"}', '["Premium", "Long Warranty"]'),
('SolarEdge 11kW HD-Wave', 'SolarEdge', 'solar-inverters', 172000.00, 4.8, 130, 'Optimized', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800', 'Smart energy.', 'Optimized energy harvest per panel.', '{"Tech": "HD-Wave"}', '["Optimized", "Award Winning"]'),
('Enphase IQ8 Plus', 'Enphase', 'solar-inverters', 18500.00, 4.9, 300, 'Microinverter', 'https://images.unsplash.com/photo-1509391366360-fe5bb6058826?w=800', 'Panel level inverter.', 'Unmatched system reliability.', '{"Type": "Micro"}', '["Reliable", "Scalable"]'),
('Victron MultiPlus-II', 'Victron Energy', 'solar-inverters', 215000.00, 4.9, 60, 'Off-grid Ready', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800', 'Extreme off-grid.', 'The professionals choice for hybrid systems.', '{"kW": "5"}', '["Off-grid", "Marine grade"]'),

-- 5. SOLAR SOLUTIONS (BATTERIES)
('Tesla Powerwall 3', 'Tesla', 'solar-batteries', 850000.00, 4.9, 150, 'Best Seller', 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800', 'Whole home backup.', 'Backup your home during outages.', '{"Capacity": "13.5kWh"}', '["Integrated Inverter", "App Control"]'),
('BYD Battery Box 11kW', 'BYD', 'solar-batteries', 540000.00, 4.8, 120, 'Scalable', 'https://images.unsplash.com/photo-1536766768598-e09213fdcf22?w=800', 'LFP Safety.', 'Scalable energy storage with LiFePO4 safety.', '{"Type": "LiFePO4"}', '["Safe", "Scalable"]'),
('LG RESU 16H', 'LG', 'solar-batteries', 720000.00, 4.7, 90, NULL, 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800', 'LG Reliability.', 'High voltage battery for smart homes.', '{"Capacity": "16kWh"}', '["High Voltage", "Compact"]'),
('Huawei Luna2000 15kWh', 'Huawei', 'solar-batteries', 650000.00, 4.7, 110, NULL, 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800', 'Smart storage.', 'Evolved power storage system.', '{"Capacity": "15kWh"}', '["Smart", "Modular"]'),

-- 6. COMPLETE SYSTEMS
('3kW Home System Basic', 'BrandMart Solar', 'solar-systems', 350000.00, 4.7, 85, 'Value', 'https://images.unsplash.com/photo-1466611653911-954ffaa13b6f?w=800', 'Essential home solar.', 'Complete kit for standard residential needs.', '{"kW": "3"}', '["Installation Incl", "Panels Incl"]'),
('5kW Home System Standard', 'BrandMart Solar', 'solar-systems', 580000.00, 4.8, 110, 'Common Choice', 'https://images.unsplash.com/photo-1509391366360-fe5bb6058826?w=800', 'Modern home energy.', 'Balanced system for medium families.', '{"kW": "5"}', '["Hybrid Ready", "High Yield"]'),
('10kW Home System Premium', 'BrandMart Solar', 'solar-systems', 1250000.00, 4.9, 50, 'Premium', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800', 'Complete Power.', 'Massive system for whole home independence.', '{"kW": "10"}', '["Panel Optimizers", "Full Warranty"]'),
('20kW Commercial Kit', 'BrandMart Solar', 'solar-systems', 2850000.00, 4.9, 20, 'Enterprise', 'https://images.unsplash.com/photo-1509391366360-fe5bb6058826?w=800', 'Enterprise energy.', 'Professional utility grade commercial system.', '{"kW": "20"}', '["Utility Grade", "Max Output"]');

-- ============================================================
-- NEW TABLES — Run once to add full e-commerce functionality
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial categories from existing product data
INSERT IGNORE INTO categories (name, slug) VALUES
    ('Smartphones', 'smartphones'),
    ('Air Conditioners', 'air-conditioners'),
    ('Washing Machines', 'washing-machines'),
    ('Refrigerator','freeze');

CREATE TABLE IF NOT EXISTS carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status ENUM(
        'pending',
        'paid',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
    ) DEFAULT 'pending',
    payment_status ENUM(
        'pending',
        'paid',
        'failed'
    ) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_product_review (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wishlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_product_wishlist (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount DECIMAL(10,2),
    expiry_date DATE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed sample coupons
INSERT IGNORE INTO coupons (code, discount, expiry_date, active) VALUES
    ('WELCOME500', 500.00, '2027-12-31', TRUE),
    ('SOLAR1000', 1000.00, '2027-06-30', TRUE),
    ('FESTIVE2000', 2000.00, '2026-12-31', TRUE);

CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    amount DECIMAL(12,2),
    status ENUM(
        'pending',
        'success',
        'failed'
    ) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNIQUE NOT NULL,
    stock_quantity INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Seed Inventory with default stock for all current products
INSERT IGNORE INTO inventory (product_id, stock_quantity)
SELECT id, 50 FROM products;

