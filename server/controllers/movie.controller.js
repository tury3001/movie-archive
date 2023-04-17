const Movie = require('../database/models/Movie')
const Country = require('../database/models/Country')

const add = async (req, res) => {
  const { title, year, director, genres, countries, languages, comment, synopsis, tags } = req.body

  const data = {
    title,
    year,
    director,
    genre: genres[0],
    countries: [],
    languages: languages[0],
    comment,
    synopsis,
    tags
  }

  for (countryName of countries) {
    data.countries.push(await Country.findOne({ name: countryName }))
  }

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
