import pool from "../config/db.js";

/**
 * Find user by email
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

/**
 * Find user by ID
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
            created_at,
            updated_at
        FROM users
        WHERE id = $1
        `,
    [id],
  );

  return result.rows[0];
};

/**
 * Create User
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
            is_active,
            created_at
        `,
    [fullName, email, hashedPassword, role],
  );

  return result.rows[0];
};

/**
 * Activate / Deactivate User
 */
export const updateUserStatus = async (id, isActive) => {
  await pool.query(
    `
        UPDATE users

        SET

            is_active = $1,

            updated_at = CURRENT_TIMESTAMP

        WHERE id = $2
        `,
    [isActive, id],
  );
};

/**
 * Delete User
 */
export const deleteUser = async (id) => {
  await pool.query(
    `
        DELETE
        FROM users
        WHERE id = $1
        `,
    [id],
  );
};

/**
 * Get All Users
 */
export const getAllUsers = async () => {
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

        ORDER BY id
        `,
  );

  return result.rows;
};
/**
 * Update User Profile
 */

export const updateProfile = async (id, fullName) => {
  const result = await pool.query(
    `
        UPDATE users
        SET
            full_name = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING
            id,
            full_name,
            email,
            role,
            is_active,
            created_at,
            updated_at
        `,
    [fullName, id],
  );

  return result.rows[0];
};

/**
 * Update User Password
 */

export const updatePassword = async (userId, hashedPassword) => {
  await pool.query(
    `
        UPDATE users
        SET
            password = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        `,
    [hashedPassword, userId],
  );
};

export const findUserWithPasswordById = async (id) => {
  const result = await pool.query(
    `
        SELECT *
        FROM users
        WHERE id = $1
        `,
    [id],
  );

  return result.rows[0];
};
