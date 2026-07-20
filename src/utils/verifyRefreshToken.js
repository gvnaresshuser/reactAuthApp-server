import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../config/jwt.js";

const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
};

export default verifyRefreshToken;
