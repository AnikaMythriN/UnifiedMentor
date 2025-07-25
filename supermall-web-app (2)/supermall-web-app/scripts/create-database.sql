-- SuperMall Database Schema
-- This script creates the database structure for the SuperMall application

-- Create database
CREATE DATABASE IF NOT EXISTS supermall;
USE supermall;

-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    floor VARCHAR(50) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_floor (floor),
    INDEX idx_rating (rating)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    shop_id VARCHAR(36) NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image VARCHAR(500),
    rating DECIMAL(2,1) DEFAULT 0.0,
    stock_quantity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
    INDEX idx_shop_id (shop_id),
    INDEX idx_category (category),
    INDEX idx_price (price),
    INDEX idx_rating (rating),
    INDEX idx_active (is_active)
);

-- Create offers table
CREATE TABLE IF NOT EXISTS offers (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount VARCHAR(100) NOT NULL,
    shop_id VARCHAR(36) NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    valid_until DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
    INDEX idx_shop_id (shop_id),
    INDEX idx_valid_until (valid_until),
    INDEX idx_active (is_active)
);

-- Create categories table for reference
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create floors table for reference
CREATE TABLE IF NOT EXISTS floors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    level_number INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_active (is_active)
);

-- Create logs table for audit trail
CREATE TABLE IF NOT EXISTS system_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    level ENUM('info', 'warn', 'error', 'debug') NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    user_id VARCHAR(36),
    action VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    INDEX idx_timestamp (timestamp),
    INDEX idx_level (level),
    INDEX idx_user_id (user_id),
    INDEX idx_action (action)
);

-- Create customers table (for future use)
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_active (is_active)
);

-- Create orders table (for future use)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    shipping_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    shipping_address TEXT,
    billing_address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Create order items table (for future use)
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    shop_id VARCHAR(36) NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (shop_id) REFERENCES shops(id),
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    INDEX idx_shop_id (shop_id)
);

-- Create reviews table (for future use)
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36),
    shop_id VARCHAR(36),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_product_id (product_id),
    INDEX idx_shop_id (shop_id),
    INDEX idx_rating (rating),
    INDEX idx_approved (is_approved)
);

-- Create shopping cart table (for future use)
CREATE TABLE IF NOT EXISTS shopping_cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_customer_product (customer_id, product_id),
    INDEX idx_customer_id (customer_id)
);

-- Create wishlist table (for future use)
CREATE TABLE IF NOT EXISTS wishlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_customer_product (customer_id, product_id),
    INDEX idx_customer_id (customer_id)
);

-- Create notifications table (for future use)
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    user_type ENUM('customer', 'admin') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_user_type (user_type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- Add triggers for automatic timestamp updates
DELIMITER //

CREATE TRIGGER update_shops_timestamp 
    BEFORE UPDATE ON shops 
    FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

CREATE TRIGGER update_products_timestamp 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

CREATE TRIGGER update_offers_timestamp 
    BEFORE UPDATE ON offers 
    FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

DELIMITER ;

-- Create views for common queries
CREATE VIEW active_shops AS
SELECT s.*, 
       COUNT(p.id) as product_count,
       COUNT(o.id) as offer_count
FROM shops s
LEFT JOIN products p ON s.id = p.shop_id AND p.is_active = TRUE
LEFT JOIN offers o ON s.id = o.shop_id AND o.is_active = TRUE AND o.valid_until >= CURDATE()
GROUP BY s.id;

CREATE VIEW active_products AS
SELECT p.*, s.name as shop_name, s.category as shop_category
FROM products p
JOIN shops s ON p.shop_id = s.id
WHERE p.is_active = TRUE;

CREATE VIEW active_offers AS
SELECT o.*, s.name as shop_name, s.category as shop_category
FROM offers o
JOIN shops s ON o.shop_id = s.id
WHERE o.is_active = TRUE AND o.valid_until >= CURDATE();

-- Add indexes for better performance
CREATE INDEX idx_products_shop_category ON products(shop_id, category);
CREATE INDEX idx_offers_valid_active ON offers(valid_until, is_active);
CREATE INDEX idx_logs_timestamp_level ON system_logs(timestamp, level);

-- Add full-text search indexes
ALTER TABLE shops ADD FULLTEXT(name, description);
ALTER TABLE products ADD FULLTEXT(name, description);
ALTER TABLE offers ADD FULLTEXT(title, description);

COMMIT;
