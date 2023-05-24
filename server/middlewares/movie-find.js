const Movie = require("../database/models/Movie")

const movieFind = async (req, res, next) => {

  const { movieId } = req.params

  const movie = await Movie.findById(movieId)

  if (!movie) {
    return res.status(400).json({ msg: 'Given movie does not exist' })
  }

  req.movie = movie

  next()
}

module.exports = { movieFind }