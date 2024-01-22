const { Schema, model } = require('mongoose')

const Country = new Schema({
  name: String,
  code: String
})

module.exports = model('Country', Country)
