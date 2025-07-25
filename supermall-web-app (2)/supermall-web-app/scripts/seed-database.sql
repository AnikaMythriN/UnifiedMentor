-- SuperMall Database Seed Data
-- This script populates the database with initial data for testing and demonstration

USE supermall;

-- Insert categories
INSERT INTO categories (name, description, icon) VALUES
('Electronics', 'Electronic devices and gadgets', 'smartphone'),
('Fashion', 'Clothing, accessories, and fashion items', 'shirt'),
('Food', 'Food items, beverages, and restaurants', 'utensils'),
('Books', 'Books, magazines, and educational materials', 'book'),
('Home & Garden', 'Home improvement and gardening supplies', 'home'),
('Sports', 'Sports equipment and fitness gear', 'dumbbell');

-- Insert floors
INSERT INTO floors (name, description, level_number) VALUES
('Ground Floor', 'Main entrance level with major stores', 0),
('First Floor', 'Fashion and lifestyle stores', 1),
('Second Floor', 'Food court and restaurants', 2),
('Third Floor', 'Entertainment and sports facilities', 3);

-- Insert admin user (password: admin123 - hashed)
INSERT INTO admin_users (id, email, password_hash, name, role) VALUES
('admin-001', 'admin@supermall.com', '$2b$12$VzPH9kLt16qidN6ZbMfbU.w7oj2tPk18taJVO/XTZ7LMg5A9DplnC', 'System Administrator', 'admin');

-- Insert shops
INSERT INTO shops (id, name, description, location, category, floor, rating, image) VALUES
('shop-001', 'TechWorld Electronics', 'Latest gadgets and electronics for tech enthusiasts', 'Mall Center, Section A', 'Electronics', 'Ground Floor', 4.5, ''),
('shop-002', 'Fashion Forward', 'Trendy clothing and accessories for all ages', 'Mall Center, Section B', 'Fashion', 'First Floor', 4.2, ''),
('shop-003', 'Gourmet Corner', 'Delicious food and beverages', 'Food Court, Section C', 'Food', 'Second Floor', 4.7, ''),
('shop-004', 'Book Haven', 'Wide collection of books and educational materials', 'Mall Center, Section D', 'Books', 'First Floor', 4.3, ''),
('shop-005', 'Home & Garden Plus', 'Everything for your home and garden needs', 'Mall Center, Section E', 'Home & Garden', 'Ground Floor', 4.1, ''),
('shop-006', 'Sports Zone', 'Sports equipment and fitness gear', 'Mall Center, Section F', 'Sports', 'Third Floor', 4.4, ''),
('shop-007', 'Digital Dreams', 'Computer hardware and software solutions', 'Mall Center, Section G', 'Electronics', 'Ground Floor', 4.6, ''),
('shop-008', 'Style Studio', 'Premium fashion and designer wear', 'Mall Center, Section H', 'Fashion', 'First Floor', 4.8, ''),
('shop-009', 'Taste Buds', 'International cuisine and local delicacies', 'Food Court, Section I', 'Food', 'Second Floor', 4.5, ''),
('shop-010', 'Knowledge Hub', 'Academic books and professional resources', 'Mall Center, Section J', 'Books', 'First Floor', 4.2, '');

-- Insert products
INSERT INTO products (id, name, description, price, original_price, shop_id, shop_name, category, rating, stock_quantity) VALUES
-- TechWorld Electronics products
('prod-001', 'Smartphone Pro Max', 'Latest flagship smartphone with advanced features', 999.00, 1199.00, 'shop-001', 'TechWorld Electronics', 'Electronics', 4.6, 25),
('prod-002', 'Wireless Headphones', 'Premium noise-cancelling wireless headphones', 299.00, 399.00, 'shop-001', 'TechWorld Electronics', 'Electronics', 4.4, 40),
('prod-003', 'Smart Watch', 'Fitness tracking smartwatch with health monitoring', 249.00, 299.00, 'shop-001', 'TechWorld Electronics', 'Electronics', 4.3, 30),
('prod-004', 'Bluetooth Speaker', 'Portable wireless speaker with premium sound', 89.00, 129.00, 'shop-001', 'TechWorld Electronics', 'Electronics', 4.2, 50),

-- Fashion Forward products
('prod-005', 'Designer Jacket', 'Stylish winter jacket for modern fashion', 149.00, NULL, 'shop-002', 'Fashion Forward', 'Fashion', 4.3, 20),
('prod-006', 'Casual Sneakers', 'Comfortable sneakers for everyday wear', 89.00, 120.00, 'shop-002', 'Fashion Forward', 'Fashion', 4.2, 35),
('prod-007', 'Summer Dress', 'Elegant summer dress for special occasions', 79.00, 99.00, 'shop-002', 'Fashion Forward', 'Fashion', 4.5, 25),
('prod-008', 'Leather Handbag', 'Premium leather handbag with multiple compartments', 199.00, 249.00, 'shop-002', 'Fashion Forward', 'Fashion', 4.7, 15),

-- Gourmet Corner products
('prod-009', 'Gourmet Pizza', 'Delicious handmade pizza with premium ingredients', 18.00, NULL, 'shop-003', 'Gourmet Corner', 'Food', 4.8, 100),
('prod-010', 'Artisan Coffee', 'Premium roasted coffee beans from local farms', 24.00, 29.00, 'shop-003', 'Gourmet Corner', 'Food', 4.6, 80),
('prod-011', 'Chocolate Cake', 'Rich chocolate cake made with finest cocoa', 32.00, NULL, 'shop-003', 'Gourmet Corner', 'Food', 4.9, 20),
('prod-012', 'Fresh Sandwich', 'Daily made sandwiches with organic ingredients', 12.00, 15.00, 'shop-003', 'Gourmet Corner', 'Food', 4.4, 60),

-- Book Haven products
('prod-013', 'Programming Guide', 'Complete guide to modern programming languages', 45.00, 60.00, 'shop-004', 'Book Haven', 'Books', 4.5, 40),
('prod-014', 'Business Strategy', 'Essential business strategies for entrepreneurs', 35.00, 45.00, 'shop-004', 'Book Haven', 'Books', 4.3, 30),
('prod-015', 'Science Fiction Novel', 'Bestselling science fiction adventure story', 19.00, 25.00, 'shop-004', 'Book Haven', 'Books', 4.6, 50),
('prod-016', 'Cooking Masterclass', 'Professional cooking techniques and recipes', 42.00, NULL, 'shop-004', 'Book Haven', 'Books', 4.4, 25),

-- Home & Garden Plus products
('prod-017', 'Garden Tool Set', 'Professional garden tools for home gardening', 79.00, NULL, 'shop-005', 'Home & Garden Plus', 'Home & Garden', 4.1, 20),
('prod-018', 'Indoor Plant Collection', 'Beautiful indoor plants for home decoration', 45.00, 55.00, 'shop-005', 'Home & Garden Plus', 'Home & Garden', 4.3, 35),
('prod-019', 'Kitchen Appliance Set', 'Essential kitchen appliances for modern cooking', 299.00, 399.00, 'shop-005', 'Home & Garden Plus', 'Home & Garden', 4.2, 15),
('prod-020', 'Home Decor Bundle', 'Stylish home decoration items and accessories', 129.00, 159.00, 'shop-005', 'Home & Garden Plus', 'Home & Garden', 4.0, 25),

-- Sports Zone products
('prod-021', 'Fitness Tracker', 'Advanced fitness tracker with health monitoring', 199.00, 249.00, 'shop-006', 'Sports Zone', 'Sports', 4.3, 30),
('prod-022', 'Yoga Mat Set', 'Premium yoga mat with accessories', 59.00, 79.00, 'shop-006', 'Sports Zone', 'Sports', 4.5, 40),
('prod-023', 'Running Shoes', 'Professional running shoes for athletes', 149.00, 189.00, 'shop-006', 'Sports Zone', 'Sports', 4.6, 25),
('prod-024', 'Gym Equipment Set', 'Complete home gym equipment for fitness', 399.00, 499.00, 'shop-006', 'Sports Zone', 'Sports', 4.4, 10);

-- Insert offers
INSERT INTO offers (id, title, description, discount, shop_id, shop_name, valid_until) VALUES
('offer-001', 'Electronics Mega Sale', 'Get up to 30% off on all electronics items', '30% OFF', 'shop-001', 'TechWorld Electronics', '2024-12-31'),
('offer-002', 'Fashion Week Special', 'Buy 2 get 1 free on all fashion items', 'Buy 2 Get 1', 'shop-002', 'Fashion Forward', '2024-11-30'),
('offer-003', 'Food Festival', 'Special combo meals at discounted prices', '25% OFF', 'shop-003', 'Gourmet Corner', '2024-10-31'),
('offer-004', 'Book Lovers Deal', 'Free shipping on orders above $30', 'Free Shipping', 'shop-004', 'Book Haven', '2024-12-15'),
('offer-005', 'Home Makeover Sale', 'Up to 40% off on home and garden items', '40% OFF', 'shop-005', 'Home & Garden Plus', '2024-11-15'),
('offer-006', 'Fitness Challenge', 'Special discounts on sports equipment', '20% OFF', 'shop-006', 'Sports Zone', '2024-12-01'),
('offer-007', 'Tech Tuesday', 'Every Tuesday get extra 10% off on gadgets', '10% Extra', 'shop-007', 'Digital Dreams', '2024-12-31'),
('offer-008', 'Style Saturday', 'Weekend special on premium fashion items', '35% OFF', 'shop-008', 'Style Studio', '2024-11-30'),
('offer-009', 'Taste Test Thursday', 'Try new dishes with special pricing', '15% OFF', 'shop-009', 'Taste Buds', '2024-10-31'),
('offer-010', 'Knowledge Week', 'Educational books at student-friendly prices', '25% OFF', 'shop-010', 'Knowledge Hub', '2024-12-20');

-- Insert sample customers (for future use)
INSERT INTO customers (id, email, password_hash, first_name, last_name, phone, city, state, country) VALUES
('cust-001', 'john.doe@email.com', '$2b$10$rOzJqQZJqQZJqQZJqQZJqO', 'John', 'Doe', '+1-555-0101', 'New York', 'NY', 'USA'),
('cust-002', 'jane.smith@email.com', '$2b$10$rOzJqQZJqQZJqQZJqQZJqO', 'Jane', 'Smith', '+1-555-0102', 'Los Angeles', 'CA', 'USA'),
('cust-003', 'mike.johnson@email.com', '$2b$10$rOzJqQZJqQZJqQZJqQZJqO', 'Mike', 'Johnson', '+1-555-0103', 'Chicago', 'IL', 'USA'),
('cust-004', 'sarah.wilson@email.com', '$2b$10$rOzJqQZJqQZJqQZJqQZJqO', 'Sarah', 'Wilson', '+1-555-0104', 'Houston', 'TX', 'USA'),
('cust-005', 'david.brown@email.com', '$2b$10$rOzJqQZJqQZJqQZJqQZJqO', 'David', 'Brown', '+1-555-0105', 'Phoenix', 'AZ', 'USA');

-- Insert sample reviews
INSERT INTO reviews (id, customer_id, product_id, shop_id, rating, title, comment, is_verified) VALUES
('rev-001', 'cust-001', 'prod-001', 'shop-001', 5, 'Amazing smartphone!', 'Best phone I have ever used. Great camera and battery life.', TRUE),
('rev-002', 'cust-002', 'prod-005', 'shop-002', 4, 'Stylish jacket', 'Love the design and quality. Perfect for winter.', TRUE),
('rev-003', 'cust-003', 'prod-009', 'shop-003', 5, 'Delicious pizza', 'Best pizza in the mall! Fresh ingredients and great taste.', TRUE),
('rev-004', 'cust-004', 'prod-013', 'shop-004', 4, 'Great programming book', 'Very helpful for learning new programming concepts.', TRUE),
('rev-005', 'cust-005', 'prod-021', 'shop-006', 4, 'Good fitness tracker', 'Accurate tracking and long battery life. Recommended!', TRUE);

-- Insert sample system logs
INSERT INTO system_logs (level, message, data, user_id, action) VALUES
('info', 'Database seeded successfully', '{"tables": ["shops", "products", "offers", "customers"]}', 'admin-001', 'database_seed'),
('info', 'Initial admin user created', '{"email": "admin@supermall.com"}', 'admin-001', 'admin_creation'),
('info', 'Sample data inserted', '{"shops": 10, "products": 24, "offers": 10}', 'admin-001', 'data_insertion');

-- Create some sample shopping cart entries
INSERT INTO shopping_cart (customer_id, product_id, quantity) VALUES
('cust-001', 'prod-001', 1),
('cust-001', 'prod-002', 2),
('cust-002', 'prod-005', 1),
('cust-003', 'prod-009', 3),
('cust-004', 'prod-013', 1),
('cust-005', 'prod-021', 1);

-- Create some wishlist entries
INSERT INTO wishlist (customer_id, product_id) VALUES
('cust-001', 'prod-003'),
('cust-001', 'prod-007'),
('cust-002', 'prod-008'),
('cust-003', 'prod-011'),
('cust-004', 'prod-015'),
('cust-005', 'prod-023');

-- Update shop ratings based on reviews
UPDATE shops s SET rating = (
    SELECT COALESCE(AVG(r.rating), 0)
    FROM reviews r 
    WHERE r.shop_id = s.id AND r.is_approved = TRUE
) WHERE EXISTS (
    SELECT 1 FROM reviews r WHERE r.shop_id = s.id AND r.is_approved = TRUE
);

-- Update product ratings based on reviews
UPDATE products p SET rating = (
    SELECT COALESCE(AVG(r.rating), 0)
    FROM reviews r 
    WHERE r.product_id = p.id AND r.is_approved = TRUE
) WHERE EXISTS (
    SELECT 1 FROM reviews r WHERE r.product_id = p.id AND r.is_approved = TRUE
);

COMMIT;

-- Display summary of seeded data
SELECT 'Data Seeding Complete' as Status;
SELECT 'Shops' as Table_Name, COUNT(*) as Record_Count FROM shops
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Offers', COUNT(*) FROM offers
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Floors', COUNT(*) FROM floors
UNION ALL
SELECT 'Admin Users', COUNT(*) FROM admin_users
UNION ALL
SELECT 'Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'Shopping Cart Items', COUNT(*) FROM shopping_cart
UNION ALL
SELECT 'Wishlist Items', COUNT(*) FROM wishlist;
