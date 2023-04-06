const { Schema, model } = require('mongoose')

const Language = new Schema({
  name: String,
  code: String
})

module.exports = model('Language', Language)
