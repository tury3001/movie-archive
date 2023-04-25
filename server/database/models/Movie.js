const { Schema, model } = require('mongoose')

const MovieSchema = new Schema({
  title: String,
  year: Number,
  director: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: false
  },
  cast: [{
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: false
  }],
  genres: [{
    type: Schema.Types.ObjectId,
    ref: 'Genre',
    required: false
  }],
  countries: [{
    type: Schema.Types.ObjectId,
    ref: 'Country',
    required: false
  }],
  languages: [{
    type: Schema.Types.ObjectId,
    ref: 'Language',
    required: false
  }],
  synopsis: String,
  comment: String
})

module.exports = model('Movie', MovieSchema)
