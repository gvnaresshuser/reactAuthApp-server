import dotenv from "dotenv";
dotenv.config();
import { getCookieMaxAge } from "./helper.js";
/**
 * Refresh Token Cookie Options
 */
console.log("REFRESH_TOKEN_EXPIRY :: " + process.env.REFRESH_TOKEN_EXPIRY);

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  ////maxAge: 7 * 24 * 60 * 60 * 1000,
  ////maxAge: 30 * 1000, // 30 seconds
  maxAge: getCookieMaxAge(process.env.REFRESH_TOKEN_EXPIRY),
};

export default cookieOptions;
