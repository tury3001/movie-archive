const { Schema, model } = require('mongoose')

const ArtistSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  gender: String,
  bornDate: Date,
  bornPlace: String,
  nationality: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
    required: false
  },
  bio: String
})

module.exports = model('Artist', ArtistSchema)