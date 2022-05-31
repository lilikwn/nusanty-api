const jwt = require('jsonwebtoken');
const { SECRET_KEY_API } = require('./secretKeyAPI');

const verifyTokenAPI = (req, res, next) => {
  const token = req.header('token-api');
  try {
    const verified = jwt.verify(token, SECRET_KEY_API);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: 'Invalid Token API',
    });
  }
};
module.exports = { verifyTokenAPI };
