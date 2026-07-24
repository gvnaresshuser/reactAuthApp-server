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
/* export const deleteExpiredRefreshTokens = async () => {
  await pool.query(
    `
    DELETE
    FROM refresh_tokens
    WHERE expires_at <= CURRENT_TIMESTAMP
    `,
  );
}; */
export const deleteExpiredRefreshTokens = async () => {
  const before = await pool.query(`
    SELECT
      id,
      expires_at,
      CURRENT_TIMESTAMP AS db_time
    FROM refresh_tokens
    ORDER BY id;
  `);

  console.log("Before Delete");
  console.table(before.rows);

  const now = await pool.query(`
    SELECT
        CURRENT_TIMESTAMP,
        LOCALTIMESTAMP
`);

  console.log(now.rows);

  const result = await pool.query(`
    DELETE
    FROM refresh_tokens
    WHERE expires_at <= CURRENT_TIMESTAMP
  `);

  console.log("Deleted Rows:", result.rowCount);

  const after = await pool.query(`
    SELECT
      id,
      expires_at,
      CURRENT_TIMESTAMP AS db_time
    FROM refresh_tokens
    ORDER BY id;
  `);

  console.log("After Delete");
  console.table(after.rows);
};

export const deleteExpiredRefreshTokensByUserId = async (userId) => {
  const query = `
    DELETE
    FROM refresh_tokens
    WHERE user_id = $1
      AND expires_at <= CURRENT_TIMESTAMP
    RETURNING id;
  `;

  const { rows, rowCount } = await pool.query(query, [userId]);

  console.log(
    `Deleted ${rowCount} expired refresh token(s) for User ${userId}`,
  );

  return {
    deletedCount: rowCount,
    deletedTokens: rows,
  };
};