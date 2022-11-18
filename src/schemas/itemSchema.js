const mongoose = require('mongoose');

const { Schema } = mongoose;

const Item = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 3,
  },
  photo: {
    type: String,
    minLength: 3,
  },
  bids: [{ user: String, price: Number }],

  date: Date,
});

module.exports = mongoose.model('Item', Item);
