const { register, login } = require("../services/auth.service");

exports.register = async (req, res, next) => {
  try {
    const data = await register(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const data = await login(req.body.email, req.body.password);
    res.json(data);
  } catch (error) {
    next(error);
  }
};