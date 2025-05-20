const dotenv = require("dotenv");
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

dotenv.config();

const WooCommerce = new WooCommerceRestApi({
  url: process.env.WC_API_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: "wc/v3",
  queryStringAuth: true,
});

const createWooCommerceProduct = async (productData) => {
  const images = Array.isArray(productData.images)
    ? productData.imageUrl.map((image) => ({
        src: image,
      }))
    : [
        {
          src: productData.imageUrl,
        },
      ];

  const data = {
    name: productData.name,
    type: "simple",
    regular_price: String(productData.price),
    description: productData.description,
    short_description:
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    // categories: [],
    images,
  };

  try {
    const response = await WooCommerce.post("products", data);
    return response.data;
  } catch (error) {
    console.error(
      "WooCommerce API Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const updateProductInWooCommerce = async (prdouctId, productData, product) => {
  const images = Array.isArray(productData.images)
    ? productData.imageUrl.map((image) => ({
        src: image,
      }))
    : [
        {
          src: productData.imageUrl,
        },
      ];

  const data = {
    name: productData.name != undefined ? productData.name : product.name,
    type: "simple",
    regular_price: productData.price != undefined ? String(productData.price) : String(product.regular_price),
    description: productData.description != undefined ? productData.description : product.description,
    short_description:
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    images: productData.images != undefined ? images : product.images,
  };

  try {
    const response = await WooCommerce.put(`products/${prdouctId}`, data);
    return response.data;
  } catch (error) {
    console.error(
      "WooCommerce API Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

deleteProductInWooCommerce = async (productId) => {
  try {
    const response = await WooCommerce.delete(`products/${productId}`, {
      force: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "WooCommerce API Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = {
  createWooCommerceProduct,
  updateProductInWooCommerce,
  deleteProductInWooCommerce,
};
