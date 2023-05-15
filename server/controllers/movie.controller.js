const Movie = require('../database/models/Movie')
const Artist = require('../database/models/Artist')

const add = async (req, res) => {
  const { title, year, director, cast, genres, countries, languages, comment, synopsis, tags } = req.body

  const data = {
    title,
    year,
    director,
    cast,
    genres,
    countries,
    languages,
    comment,
    synopsis,
    tags
  }  

  try {
    const movie = new Movie(data)
    await movie.save()
  } catch (error) {
    console.log('Movie can\'t be saved')
    console.log(error)
  }

  res.status(201).json({ msg: 'Movie has been saved' })
}

const update = async (req, res) => {

  const { title, year, director, synopsis, genres, countries, languages } = req.body

  try {
    const movie = await Movie.findById(req.params.id)

    if (!movie)
      return res.status(400).json({ msg: 'Movie does not exist' })

    movie.title = title || movie.title
    movie.year = year || movie.year
    movie.director = director || movie.director
    movie.synopsis = synopsis ?? movie.synopsis        
    movie.genres = genres ?? movie.genres
    movie.countries = countries ?? movie.countries
    movie.languages = languages ?? movie.languages

    await movie.save()
      
  } catch (error) {
    console.log('Movie can\'t be updated')
    console.log(error)
  }

  res.status(200).json({ msg: 'Movie updated' })
}

module.exports = { add, update }
