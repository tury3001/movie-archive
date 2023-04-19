const Movie = require('../database/models/Movie')
const Language = require('../database/models/Language')

const add = async (req, res) => {
  const { title, year, director, genres, countries, languages, comment, synopsis, tags } = req.body

  const data = {
    title,
    year,
    director,
    genre: genres[0],
    countries,
    languages,
    comment,
    synopsis,
    tags
  }

  const linkLanguage = await Language.findOne({ name: languages[0] })
  data.languages = [ linkLanguage ]

  try {
    const movie = new Movie(data)
    await movie.save()
  } catch (error) {
    console.log('Movie can\'t be saved')
    console.log(error)
  }

  res.status(201).json({ message: 'Movie has been saved' })
}

module.exports = { add }
