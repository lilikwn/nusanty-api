const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    max: 255,
  },
  userInfo: {
    userId: {
      type: String,
      required: true,
      max: 255,
    },
    name: {
      type: String,
      required: true,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      max: 100,
    },
  },
});

module.exports = mongoose.model('Session', sessionSchema);
