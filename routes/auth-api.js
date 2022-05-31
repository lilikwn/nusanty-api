const express = require('express');

const router = express.Router();
const uniqid = require('uniqid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerValidation } = require('../configs/validation');
const { SECRET_KEY, SECRET_KEY_USER } = require('../configs/secretKeyUser');

const { verifyTokenAPI } = require('../configs/verifyTokenAPI');

// POST register API
router.post('/register', verifyTokenAPI, async (req, res) => {
  // Validate the data format sent to the server
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({
      status: res.statusCode,
      message: error.details[0].message,
    });
  }

  // If email Exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).json({
      status: res.statusCode,
      message: 'Email already registered',
    });
  }

  // Generate Unique ID
  const generateID = uniqid();

  // Hash Password using uniqid
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // Input data user
  const user = new User({
    userId: generateID,
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  // try catch save data user
  try {
    const saveUser = await user.save();
    res.json(saveUser);
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: 'Failed to add User',
    });
  }
});

/* POST login page */
router.post('/login', verifyTokenAPI, async (req, res, next) => {
  // If email not registered
  const user = await User.findOne({ mail: req.body.email });
  if (!user) {
    return res.status(400).json({
      statusCode: res.statusCode,
      message: 'Sorry, we could not find your email.',
    });
  }

  // Check Password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  console.log(validPassword);
  if (!validPassword) {
    return res.status(400).json({
      status: res.statusCode,
      message: 'Wrong Password!',
    });
  }

  // If email & password are correct

  const token = jwt.sign({
    id: user.userId,
    email: user.email,
  }, SECRET_KEY_USER);

  res.header(token).json({
    token,
  });
});

module.exports = router;
