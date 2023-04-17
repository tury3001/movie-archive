const { Schema, model } = require('mongoose')

const MovieSchema = new Schema({
  title: String,
  year: Number,
  director: String,
  genre: String,
  countries: [{
    type: Schema.Types.ObjectId,
    ref: 'Country',
    required: false
  }],
  language: String,
  synopsis: String,
  comment: String
})

module.exports = model('Movie', MovieSchema)
