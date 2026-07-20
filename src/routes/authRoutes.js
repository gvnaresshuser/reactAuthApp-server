import { Router } from "express";
const router = Router();
import { register, login, logout, logoutAllDevices } from "../controllers/authController.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator.js";
import validateMiddleware from "../middleware/validateMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  profile,
  updateProfile,
  changePassword,
  refreshToken,
} from "../controllers/authController.js";
import { updateProfileValidator } from "../validators/authValidator.js";
import { changePasswordValidator } from "../validators/authValidator.js";
/**
 * Authentication Routes
 */

router.post("/register", registerValidator, validateMiddleware, register);
router.post("/login", loginValidator, validateMiddleware, login);
router.get("/profile", authMiddleware, profile);
router.put(
  "/profile",
  authMiddleware,
  updateProfileValidator,
  validateMiddleware,
  updateProfile,
);
router.put(
  "/change-password",
  authMiddleware,
  changePasswordValidator,
  validateMiddleware,
  changePassword,
);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/logout-all", authMiddleware, logoutAllDevices);

export default router;
