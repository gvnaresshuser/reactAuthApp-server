import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

console.log(process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const seedDatabase = async () => {
  try {
    console.log("🌱 Seeding database...\n");

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 12);

    // Clear existing data
    await pool.query("DELETE FROM products");
    await pool.query("DELETE FROM users");

    // Reset auto increment
    await pool.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await pool.query("ALTER SEQUENCE products_id_seq RESTART WITH 1");

    // Insert Admin
    const userResult = await pool.query(
      `
            INSERT INTO users
            (
                full_name,
                email,
                password,
                role
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING id
            `,
      ["System Administrator", "admin@gmail.com", hashedPassword, "ADMIN"],
    );

    const adminId = userResult.rows[0].id;

    // Products
    const products = [
      [
        "Apple iPhone 16",
        "Latest Apple Smartphone",
        79999,
        20,
        "Mobiles",
        "https://picsum.photos/300/200?1",
      ],
      [
        "Samsung Galaxy S25",
        "Android Flagship",
        72999,
        18,
        "Mobiles",
        "https://picsum.photos/300/200?2",
      ],
      [
        "Dell Inspiron 15",
        "Intel Core Ultra Laptop",
        65999,
        8,
        "Laptops",
        "https://picsum.photos/300/200?3",
      ],
      [
        "Boat Rockerz",
        "Wireless Headphones",
        2999,
        35,
        "Accessories",
        "https://picsum.photos/300/200?4",
      ],
      [
        "Apple Watch",
        "Smart Watch",
        34999,
        12,
        "Wearables",
        "https://picsum.photos/300/200?5",
      ],
    ];

    for (const product of products) {
      await pool.query(
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
                    $1,$2,$3,$4,$5,$6,$7
                )
                `,
        [...product, adminId],
      );
    }

    console.log("✅ Database seeded successfully.");
    console.log("\nAdmin Login");
    console.log("---------------------------");
    console.log("Email    : admin@gmail.com");
    console.log("Password : admin123");
    console.log("---------------------------");
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
};

seedDatabase();
