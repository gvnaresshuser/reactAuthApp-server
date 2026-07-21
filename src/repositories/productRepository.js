import pool from "../config/db.js";

// Create Product
export const createProduct = async (productData) => {
  const { name, description, price, stock, category, image_url, created_by } =
    productData;

  const result = await pool.query(
    `
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
            $1, $2, $3, $4, $5, $6, $7
        )
        RETURNING *;
        `,
    [name, description, price, stock, category, image_url, created_by],
  );

  return result.rows[0];
};

// Find Product By Id
export const findProductById = async (id) => {
  const result = await pool.query(
    `
        SELECT *
        FROM products
        WHERE id = $1
        `,
    [id],
  );

  return result.rows[0] || null;
};

// Find All Products
export const findAllProducts = async () => {
  const result = await pool.query(
    `
        SELECT *
        FROM products
        ORDER BY created_at DESC
        `,
  );

  return result.rows;
};

// Update Product
export const updateProduct = async (id, productData) => {
  const { name, description, price, stock, category, image_url } = productData;

  const result = await pool.query(
    `
        UPDATE products
        SET
            name = $1,
            description = $2,
            price = $3,
            stock = $4,
            category = $5,
            image_url = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *;
        `,
    [name, description, price, stock, category, image_url, id],
  );

  return result.rows[0] || null;
};

// Delete Product
export const deleteProduct = async (id) => {
  await pool.query(
    `
        DELETE
        FROM products
        WHERE id = $1
        `,
    [id],
  );
};
