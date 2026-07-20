import pool from "../config/db.js";

/**
 * Create Refresh Token
 */
export const createRefreshToken = async (userId, tokenHash, expiresAt) => {
  const result = await pool.query(
    `
        INSERT INTO refresh_tokens
        (
            user_id,
            token,
            expires_at
        )
        VALUES
        (
            $1,
            $2,
            $3
        )
        RETURNING *
        `,
    [userId, tokenHash, expiresAt],
  );

  return result.rows[0];
};

/**
 * Delete one refresh token
 */
export const deleteRefreshToken = async (id) => {
  await pool.query(
    `
        DELETE
        FROM refresh_tokens
        WHERE id = $1
        `,
    [id],
  );
};

/**
 * Delete All Refresh Tokens for a User
 */
export const deleteAllRefreshTokens = async (userId) => {
  await pool.query(
    `
    DELETE
    FROM refresh_tokens
    WHERE user_id = $1
    `,
    [userId],
  );
};
/**
 * Get all refresh tokens for a user
 */
export const findRefreshTokensByUserId = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      token,
      expires_at
    FROM refresh_tokens
    WHERE user_id = $1
    `,
    [userId],
  );

  return result.rows;
};
/*************************************************
 * Delete Expired Refresh Tokens
 *************************************************/
export const deleteExpiredRefreshTokens = async () => {
  await pool.query(
    `
    DELETE
    FROM refresh_tokens
    WHERE expires_at <= CURRENT_TIMESTAMP
    `,
  );
};
