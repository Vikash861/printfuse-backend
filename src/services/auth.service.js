const prisma = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    },
  });
  return {
    statusCode: 201,
    status: "success",
    data: { user },
    message: "User registered successfully"
  };
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return {
    statusCode: 200,
    status: "success",
    data: { user,token },
    message: "User LoggedIn successfully"
  };
};

module.exports = { register, login };