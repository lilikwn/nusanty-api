const express = require('express');

const router = express.Router();
const uniqid = require('uniqid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
const Session = require('../models/Session');
const { registerValidation } = require('../configs/validation');

const { verifyTokenAPI } = require('../configs/verifyTokenAPI');

// POST register API
router.post('/register', verifyTokenAPI, async (req, res) => {
  // Validate the data format sent to the server
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({
      error: true,
      status: res.statusCode,
      message: error.details[0].message,
    });
  }

  // If email Exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).json({
      error: true,
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
    res.json({
      status: res.statusCode,
      error: false,
      message: 'User Created',
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      status: res.statusCode,
      message: 'Failed to add User',
    });
  }
});

/* POST login page */
router.post('/login', verifyTokenAPI, async (req, res, next) => {
  // If email not registered
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({
      error: true,
      statusCode: res.statusCode,
      message: 'Sorry, we could not find your email.',
    });
  }

  // Check Password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({
      error: true,
      status: res.statusCode,
      message: 'Wrong Password!',
    });
  }

  // If email & password are correct
  const token = jwt.sign({
    loginId: uniqid(),
    id: user.userId,
    email: user.email,
  }, process.env.SESSION);

  const session = await new Session({
    status: res.statusCode,
    sessionId: token,
    userInfo: {
      userId: user.userId,
      name: user.name,
      email: user.email,
    },
  });
  await session.save();
  res.header(token).json({
    status: res.statusCode,
    error: false,
    message: 'success',
    loginResult: {
      userId: user.userId,
      name: user.name,
      token,
    },
  });
});

router.post('/logout', verifyTokenAPI, async (req, res, next) => {
  const loadSession = await Session.findOne({ sessionId: req.body.sessionId });
  if (!loadSession) {
    return res.status(400).json({
      error: true,
      status: res.statusCode,
      message: 'Token is not found',
    });
  }
  try {
    await Session.deleteOne(loadSession);
    res.json({
      status: res.statusCode,
      error: false,
      message: 'Session is Deleted from server',
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      status: res.statusCode,
      message: "Data can't be Delete",
    });
  }
});

module.exports = router;
