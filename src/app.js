const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const healthRoutes = require("./routes/health.routes");
const errorMiddleware = require("./middlewares/error");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/health", healthRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;