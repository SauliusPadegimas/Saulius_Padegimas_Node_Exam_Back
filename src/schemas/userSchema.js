const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 3,
  },
  secret: {
    type: String,
    required: true,
    minLength: 11,
    unique: true,
  },
});

module.exports = mongoose.model('User', User);
