const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new Error("No token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) throw new Error("User not found");
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      statusCode: 401,
      status: "fail",
      message: "Authentication failed",
      data: null,
    });
  }
};

module.exports = auth;