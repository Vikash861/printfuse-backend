const express = require("express");
const router = express.Router();
const auth  = require("../middlewares/auth");
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProduct
} = require("../controllers/product.controller");

router.use(auth);

router.post("/", createProduct);

router.get("/", getProducts);

router.get("/:id", getProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;