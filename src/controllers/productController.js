import asyncHandler from "../helpers/asyncHandler.js";

import {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} from "../services/productService.js";

import { successResponse } from "../utils/apiResponse.js";
import {MESSAGES} from "../constants/messages.js";

// Create Product
export const createProduct = asyncHandler(async (req, res) => {
  const product = await createProductService(req.body, req.user.id);

  return successResponse(res, 201, MESSAGES.PRODUCT_CREATED, product);
});

// Get All Products
export const getProducts = asyncHandler(async (req, res) => {
  const products = await getProductsService();

  return successResponse(res, 200, MESSAGES.PRODUCTS_FETCHED, products);
});

// Get Product By Id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await getProductByIdService(req.params.id);

  return successResponse(res, 200, MESSAGES.PRODUCT_FETCHED, product);
});

// Update Product
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await updateProductService(req.params.id, req.body);

  return successResponse(res, 200, MESSAGES.PRODUCT_UPDATED, product);
});

// Delete Product
export const deleteProduct = asyncHandler(async (req, res) => {
  await deleteProductService(req.params.id);

  return successResponse(res, 200, MESSAGES.PRODUCT_DELETED, null);
});
