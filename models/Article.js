const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    max: 255,
  },
  title: {
    type: String,
    required: true,
    max: 255,
  },
  location: {
    type: String,
    required: true,
    max: 255,
  },
  description: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model('Article', articleSchema);
