const express = require('express');

const router = express.Router();
const Session = require('../models/Session');
const { verifyTokenAPI } = require('../configs/verifyTokenAPI');

router.post('/check', verifyTokenAPI, async (req, res, next) => {
  const loadSession = await Session.findOne({ sessionId: req.body.sessionId });
  if (loadSession) {
    return res.json({
      error: true,
      status: res.statusCode,
      message: 'Session ditemukan',
    });
  }
  res.status(400).json({
    error: false,
    status: res.statusCode,
    message: 'Code invalid',
  });
});

module.exports = router;
