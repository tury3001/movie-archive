
const Artist = require('../database/models/Artist')

const attachCast = async (req, res, next) => {

  if (req.body.cast && req.body.cast > 0) {

    console.log(req.body.cast)

    let artist
    let artists = []
    for (let artistId of req.body.cast) {
      artist = await Artist.findById(artistId)
      artists.push(artist)  
    }

    req.body.cast = artists
  }

  next()
}

module.exports = { attachCast }