-- =====================================================
-- DROP TABLES (Development Only)
-- =====================================================

DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- USERS TABLE
-- =====================================================

CREATE TABLE users (

    id SERIAL PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'USER'
        CHECK (role IN ('ADMIN', 'USER')),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- REFRESH TOKENS
-- =====================================================

CREATE TABLE refresh_tokens (

    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    token TEXT NOT NULL,

    expires_at TIMESTAMP NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_refresh_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =====================================================
-- PRODUCTS
-- =====================================================

CREATE TABLE products (

    id SERIAL PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    description TEXT,

    price NUMERIC(10,2) NOT NULL,

    stock INTEGER NOT NULL DEFAULT 0,

    category VARCHAR(100),

    image_url TEXT,

    created_by INTEGER,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_products_name
ON products(name);

CREATE INDEX idx_products_category
ON products(category);

CREATE INDEX idx_refresh_tokens_user
ON refresh_tokens(user_id);