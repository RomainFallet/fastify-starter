const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    name: String,
    color: String
  },
  { timestamps: true }
)

module.exports = mongoose.model('Cat', schema)
