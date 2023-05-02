
const Artist = require('../database/models/Artist')
const mongoose = require('mongoose')

const attachCast = async (req, res, next) => {

  if (req.body.cast && req.body.cast.length > 0) {

    if (req.body.cast.some( id => !mongoose.isValidObjectId(id)))
      return res.status(400).json({ msg: 'Given cast has invalid ids'})
    
    let artists = [];
    for (let artistId of req.body.cast) {
      artists.push(await Artist.findById(artistId))
    }

    if (artists.some( artist => artist === null))
      return res.status(400).json({ msg: 'Given artist doesn\'t exist'})

    req.body.cast = artists
  }

  next()
}

module.exports = { attachCast }