const Movie = require('../database/models/Movie')

const fetch = async (req, res) => {

  const movie = await Movie.findById(req.params.id)
                           .populate('cast')
                           .populate('genres')
                           .populate('languages')
                           .populate('countries')
                           .populate('director')
  if (!movie)  
    return res.status(400).json({ msg: 'Movie does not exist' })

  res.status(200).json(movie)
} 

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

  const { title, year, director, synopsis, comment, genres, countries, languages, tags } = req.body

  try {
    const movie = await Movie.findById(req.params.id)

    if (!movie)
      return res.status(400).json({ msg: 'Movie does not exist' })

    movie.title = title || movie.title
    movie.year = year || movie.year
    movie.director = director || movie.director
    movie.synopsis = synopsis ?? movie.synopsis
    movie.comment = comment ?? movie.comment
    movie.genres = genres ?? movie.genres
    movie.countries = countries ?? movie.countries
    movie.languages = languages ?? movie.languages
    movie.tags = tags ?? movie.tags

    await movie.save()
      
  } catch (error) {
    console.log('Movie can\'t be updated')
    console.log(error)
  }

  res.status(200).json({ msg: 'Movie updated' })
}

const remove = async (req, res) => {

  const { id } = req.params

  const movie = await Movie.findById(id)

  if (!movie)
    return res.status(400).json({ msg: 'Given movie does not exist'})

  await Movie.findOneAndDelete(id)

  res.status(200).json({ msg: 'Movie has been deleted' })
}

const search = async (req, res) => {
  const { q } = req.params

  const movies = await Movie.find({ $text: { $search: q }})

  res.status(200).json({ results: movies })
}

module.exports = { fetch, add, update, remove, search }
