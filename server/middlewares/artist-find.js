const Artist = require("../database/models/Artist")

const artistFind = async (req, res, next) => {

  const { artistId } = req.params

  const artist = await Artist.findById(artistId)

  if (!artist)
    return res.status(400).json({ msg: 'Given artist does not exist' })

  req.artist = artist

  next()
}

module.exports = { artistFind }