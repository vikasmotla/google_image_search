const mongoose = require('mongoose');

const historySchema = mongoose.Schema({
  keyword:{ type: String, required: true },
  searched_on:{ type: Date },
  images:[String]
});

module.exports = mongoose.model('History',historySchema);
