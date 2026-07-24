/**
 * Refresh Token Cookie Options
 */

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  ////maxAge: 7 * 24 * 60 * 60 * 1000,
  maxAge: 30 * 1000, // 30 seconds
};

export default cookieOptions;
