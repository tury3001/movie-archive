const Genre = require('../database/models/Genre')

const validateGenres = async(req, res, next) => {  

  if (req.body.genres !== undefined) {

    const genres = [ ...new Set( req.body.genres) ]

    let objectGenres = []
    let objGenre
    let genreExists = true

    if (req.body.genres && req.body.genres.length > 0) {
      for (let genre of genres) {
        objGenre = await Genre.findOne({ name: genre })
        if (objGenre)
          objectGenres.push(objGenre)
        else
          genreExists = false
      }
    }

    if (!genreExists)
      return res.status(400).json({ msg: 'Given genre doesn\'t exist' })

    req.body.genres = objectGenres
  }

  next()
}

module.exports = { validateGenres }