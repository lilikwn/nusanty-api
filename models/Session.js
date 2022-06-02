const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    max: 255,
  },
});

module.exports = mongoose.model('Session', sessionSchema);
