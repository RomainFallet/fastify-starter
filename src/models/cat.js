const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: String,
  color: String
})

module.exports = mongoose.model('Cat', schema)
