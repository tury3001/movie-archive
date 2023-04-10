const { Schema, model } = require('mongoose')

const ArtistSchema = new Schema({
  name: String,
  gender: String,
  bornDate: Date,
  bornPlace: String,
  nationality: String,
  bio: String
})

module.exports = model('Artist', ArtistSchema)