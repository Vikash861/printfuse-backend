const prisma = require("../config/db");
const {
  createWooCommerceProduct,
  updateProductInWooCommerce,
  deleteProductInWooCommerce,
} = require("./woocommerce.service");

const createProduct = async (productData, sellerId) => {
  // 1. Create in WooCommerce first
  let woocommerceProduct;
  try {
    woocommerceProduct = await createWooCommerceProduct(productData);
    console.log("WooCommerce product created:", woocommerceProduct);
  } catch (error) {
    throw error;
  }

  // 2. Create locally
  const product = await prisma.product.create({
    data: {
      ...productData,
      sellerId,
      woocommerceId: woocommerceProduct.id,
      status: "Synced",
    },
  });

  return { ...product, woocommerceId: woocommerceProduct.id, status: "Synced" };
};

const getProducts = async (sellerId) => {
  return prisma.product.findMany();
};

const getProduct = async (id, sellerId) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const updateProduct = async (id, productData, sellerId) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id: Number(id), sellerId },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  // 1. Update locally
  const product = await prisma.product.update({
    where: { id: Number(id), sellerId },
    data: productData,
  });

  // 2. Sync to WooCommerce

  if (product.woocommerceId) {
    try {
      await updateProductInWooCommerce(
        product.woocommerceId,
        productData,
        existingProduct
      );

      await prisma.product.update({
        where: { id: product.id },
        data: { status: "Synced" },
      });
    } catch (error) {
      await prisma.product.update({
        where: { id: product.id },
        data: { status: "Sync Failed" },
      });
      throw error;
    }
  }
  return product;
};

const deleteProduct = async (id, sellerId) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id), sellerId },
  });

  if (product?.woocommerceId) {
    try {
      await deleteProductInWooCommerce(product.woocommerceId);
    } catch (error) {
      console.error("WooCommerce delete failed:", error.message);
    }
  }

  await prisma.product.delete({ where: { id: Number(id) } });
};

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct };
