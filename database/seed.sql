-- ===========================================
-- Default Admin User
-- Password:
-- admin123
-- (We'll replace this hash after implementing bcrypt)
-- ===========================================

INSERT INTO users
(
    full_name,
    email,
    password,
    role
)
VALUES
(
    'System Administrator',
    'admin@gmail.com',
    'TEMP_PASSWORD_HASH',
    'ADMIN'
);

-- ===========================================
-- Sample Products
-- ===========================================

INSERT INTO products
(
    name,
    description,
    price,
    stock,
    category,
    image_url,
    created_by
)
VALUES

(
'Apple iPhone 16',
'Latest Apple Smartphone',
79999,
20,
'Mobiles',
'https://dummyimage.com/iphone.jpg',
1
),

(
'Samsung Galaxy S25',
'Android Flagship',
72999,
15,
'Mobiles',
'https://dummyimage.com/samsung.jpg',
1
),

(
'Dell Inspiron',
'15 Inch Laptop',
65999,
8,
'Laptops',
'https://dummyimage.com/dell.jpg',
1
),

(
'Boat Headphones',
'Wireless Bluetooth Headphones',
2999,
50,
'Accessories',
'https://dummyimage.com/headphones.jpg',
1
);