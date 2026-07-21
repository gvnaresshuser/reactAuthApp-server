import pool from "../config/db.js";

/**
 * Create Password Reset Token
 */
export const createPasswordResetToken = async (
  userId,
  tokenHash,
  expiresAt,
) => {
  const query = `
    INSERT INTO password_reset_tokens
      (user_id, token_hash, expires_at)
    VALUES
      ($1, $2, $3)
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [userId, tokenHash, expiresAt]);

  return rows[0];
};

/**
 * Find Password Reset Tokens By User
 */
export const findPasswordResetTokensByUserId = async (userId) => {
  const query = `
    SELECT *
    FROM password_reset_tokens
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;

  const { rows } = await pool.query(query, [userId]);

  return rows;
};

/**
 * Delete One Password Reset Token
 */
export const deletePasswordResetToken = async (id) => {
  const query = `
    DELETE FROM password_reset_tokens
    WHERE id = $1;
  `;

  await pool.query(query, [id]);
};

/**
 * Delete All Password Reset Tokens
 */
export const deleteAllPasswordResetTokens = async (userId) => {
  const query = `
    DELETE FROM password_reset_tokens
    WHERE user_id = $1;
  `;

  await pool.query(query, [userId]);
};

/**
 * Delete Expired Password Reset Tokens
 */
export const deleteExpiredPasswordResetTokens = async () => {
  const query = `
    DELETE FROM password_reset_tokens
    WHERE expires_at < NOW();
  `;

  await pool.query(query);
};
/**
 * Get All Password Reset Tokens
 */
export const findAllPasswordResetTokens = async () => {
  const query = `
     SELECT *
    FROM password_reset_tokens
    WHERE expires_at > NOW()
    ORDER BY created_at DESC;
  `;

  const { rows } = await pool.query(query);

  return rows;
};