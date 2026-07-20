import pool from "../config/db.js";

/*
----------------------------------------------------
Find User By Email
----------------------------------------------------
*/

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    `
        SELECT *
        FROM users
        WHERE email = $1
        `,

    [email],
  );

  return result.rows[0];
};

/*
----------------------------------------------------
Find User By Id
----------------------------------------------------
*/

export const findUserById = async (id) => {
  const result = await pool.query(
    `
        SELECT
            id,
            full_name,
            email,
            role,
            is_active,
            created_at
        FROM users
        WHERE id=$1
        `,

    [id],
  );

  return result.rows[0];
};

/*
----------------------------------------------------
Create User
----------------------------------------------------
*/

export const createUser = async (
  fullName,

  email,

  hashedPassword,

  role = "USER",
) => {
  const result = await pool.query(
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

        RETURNING

        id,
        full_name,
        email,
        role,
        created_at
        `,

    [fullName, email, hashedPassword, role],
  );

  return result.rows[0];
};
