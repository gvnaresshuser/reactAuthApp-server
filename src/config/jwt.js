/**
 * JWT Configuration
 */
import dotenv from "dotenv";
dotenv.config();


//console.log("process.env.JWT_ACCESS_SECRET::", process.env.JWT_ACCESS_SECRET);

export const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;

export const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

/**
 * Token Expiry
 */

export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;

export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
