import {
  createProduct,
  findProductById,
  findAllProducts,
  updateProduct,
  deleteProduct,
} from "../repositories/productRepository.js";

import {MESSAGES} from "../constants/messages.js";

// Create Product
export const createProductService = async (productData, userId) => {
  const newProduct = await createProduct({
    ...productData,
    created_by: userId,
  });

  return newProduct;
};

// Get All Products
export const getProductsService = async () => {
  return await findAllProducts();
};

// Get Product By Id
export const getProductByIdService = async (id) => {
  const product = await findProductById(id);

  if (!product) {
    throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
  }

  return product;
};

// Update Product
export const updateProductService = async (id, productData) => {
  const existingProduct = await findProductById(id);

  if (!existingProduct) {
    throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
  }

  const updatedProduct = {
    ...existingProduct,
    ...productData,
  };

  return await updateProduct(id, updatedProduct);
};

// Delete Product
export const deleteProductService = async (id) => {
  const existingProduct = await findProductById(id);

  if (!existingProduct) {
    throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
  }

  await deleteProduct(id);
};
