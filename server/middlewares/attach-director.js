const Artist = require('../database/models/Artist')

const attachDirector = async (req, res, next) => {

  try {

    if (req.body.director) {
      const artist = await Artist.findById(req.body.director)

      if (artist)
        req.body.director = artist
      else
        return res.status(400).json({ msg: 'Given director doesn\'t exist'})      
    }

  } catch (error) {
    return res.status(400).json({ msg: 'There was an error trying to get the director'})
  }

  next()
}

module.exports = { attachDirector }