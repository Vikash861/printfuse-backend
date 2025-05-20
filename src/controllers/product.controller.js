const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProduct
} = require("../services/product.service");

exports.createProduct = async (req, res, next) => {
  try {
    const product = await createProduct(req.body, req.user.id);
    res.status(201).json({
      statusCode: 201,
      status: "success",
      data: {product},
      message: "Product created successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res) => {
  const products = await getProducts(req.user.id);
  res.json({
    statusCode: 200,
    status: "success",
    data: { products },
    message: "Products retrieved successfully",
  });
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await getProduct(req.params.id, req.user.id);
    res.json({
      statusCode: 200,
      status: "success",
      data: { product },
      message: "Product retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await updateProduct(req.params.id, req.body, req.user.id);
    res.json({
      statusCode: 200,
      status: "success",
      data: { product },
      message: "Product updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await deleteProduct(req.params.id, req.user.id);
    res.json({
      statusCode: 200,
      status: "success",
      data: null,
      message: "Product deleted successfully",
    }); 
  } catch (error) {
    next(error);
  }
};