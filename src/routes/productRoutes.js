import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", authMiddleware, createProduct);

router.put("/:id", authMiddleware, updateProduct);

router.delete("/:id", authMiddleware, deleteProduct);

export default router;
