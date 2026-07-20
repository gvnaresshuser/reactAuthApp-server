-- ===========================================
-- Drop Tables (Development Only)
-- ===========================================

DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ===========================================
-- Users Table
-- ===========================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    role VARCHAR(20) DEFAULT 'USER'
        CHECK(role IN ('ADMIN', 'USER')),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- Products Table
-- ===========================================

CREATE TABLE products (

    id SERIAL PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    description TEXT,

    price NUMERIC(10,2) NOT NULL
        CHECK(price >= 0),

    stock INTEGER DEFAULT 0
        CHECK(stock >= 0),

    category VARCHAR(100),

    image_url TEXT,

    created_by INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_user
        FOREIGN KEY(created_by)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ===========================================
-- Useful Indexes
-- ===========================================

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_products_name
ON products(name);

CREATE INDEX idx_products_category
ON products(category);