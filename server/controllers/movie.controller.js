const Movie = require('../database/models/Movie')

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

  const { title } = req.body

  const data = {
    title
  }

  try {
    const movie = await Movie.findById(req.params.id)

    if (movie) {
      movie.title = data.title ?? movie.title
      await movie.save()
    } else {
      return res.status(400).json({ msg: 'Movie does not exist' })
    }
      
  } catch (error) {
    console.log('Movie can\'t be updated')
    console.log(error)
  }

  res.status(200).json({ msg: 'Movie updated' })
}

module.exports = { add, update }
