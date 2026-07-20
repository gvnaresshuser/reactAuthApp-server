import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const seedDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log("========================================");
    console.log("🌱 Starting Database Seed...");
    console.log("========================================");

    await client.query("BEGIN");

    // ----------------------------------------
    // Delete Existing Data
    // ----------------------------------------

    await client.query("DELETE FROM refresh_tokens");
    await client.query("DELETE FROM products");
    await client.query("DELETE FROM users");

    // ----------------------------------------
    // Reset Identity
    // ----------------------------------------

    await client.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");

    await client.query("ALTER SEQUENCE products_id_seq RESTART WITH 1");

    await client.query("ALTER SEQUENCE refresh_tokens_id_seq RESTART WITH 1");

    // ----------------------------------------
    // Hash Password
    // ----------------------------------------

    const hashedPassword = await bcrypt.hash("admin123", 12);

    // ----------------------------------------
    // Insert Admin User
    // ----------------------------------------

    const userResult = await client.query(
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

    // ----------------------------------------
    // Insert Products
    // ----------------------------------------

    const products = [
      [
        "Apple iPhone 16",
        "Latest Apple smartphone",
        79999,
        25,
        "Mobiles",
        "https://dummyimage.com/iphone16",
      ],
      [
        "Samsung Galaxy S25",
        "Flagship Android Phone",
        74999,
        30,
        "Mobiles",
        "https://dummyimage.com/galaxy",
      ],
      [
        "Sony Headphones",
        "Noise Cancelling Headphones",
        14999,
        15,
        "Electronics",
        "https://dummyimage.com/headphones",
      ],
      [
        "Dell Laptop",
        "Intel Core Ultra Laptop",
        89999,
        10,
        "Computers",
        "https://dummyimage.com/laptop",
      ],
      [
        "Apple Watch",
        "Series Smart Watch",
        45999,
        18,
        "Wearables",
        "https://dummyimage.com/watch",
      ],
    ];

    for (const product of products) {
      await client.query(
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

    // ----------------------------------------
    // Commit
    // ----------------------------------------

    await client.query("COMMIT");

    console.log("========================================");
    console.log("✅ Database Seed Completed Successfully");
    console.log("========================================");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("❌ Seed Failed");
    console.error(error);
  } finally {
    client.release();
    await pool.end();
  }
};

seedDatabase();

//Run
//npm run seed
/*
E:\MURALI\REACT-JS-CRASH-COURSE\reactAuthApp-server>npm run seed

> reactauthapp-server@1.0.0 seed
> node database/seed.js

◇ injected env (8) from .env // tip: ◈ encrypted .env [www.dotenvx.com]
(node:9008) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://www.postgresql.org/docs/current/libpq-ssl.html for libpq SSL mode definitions.
(Use `node --trace-warnings ...` to show where the warning was created)
========================================
🌱 Starting Database Seed...
========================================
========================================
✅ Database Seed Completed Successfully
========================================

E:\MURALI\REACT-JS-CRASH-COURSE\reactAuthApp-server>
*/
