const jwt = require('jsonwebtoken');

const verifyTokenAPI = (req, res, next) => {
  const token = req.header('api-key');
  try {
    const verified = jwt.verify(token, process.env.API);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({
      error: false,
      status: res.statusCode,
      message: 'Invalid Token API',
    });
  }
};
module.exports = { verifyTokenAPI };
