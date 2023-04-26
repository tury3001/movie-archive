const Artist = require('../database/models/Artist')

const artistAlreadyExists = async (req, res, next) => {

  const artist = await Artist.findOne({ name: req.body.name, bornDate: req.body.bornDate })

  if (artist)
    return res.status(400).json({ msg: 'Given artist already exists' })

  next()
}

module.exports = { artistAlreadyExists }