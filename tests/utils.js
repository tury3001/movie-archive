
const Movie = require('../src/database/models/Movie')
const Country = require('../src/database/models/Country')
const Artist = require('../src/database/models/Artist')
const Language = require('../src/database/models/Language')
const Genre = require('../src/database/models/Genre')

const { getArtistData } = require('./samples/artist-data-sample')

async function insertMovieInDB ( movieData ) {

  let artist = getArtistData(0)
  let country = await Country.findOne({ name: artist.nationality })
  artist.nationality = country._id
  const createdArtist = await Artist.create(artist)

  movieData.director = createdArtist._id.toString()
  
  const country1 = await Country.findOne({ name: 'Argentina'})
  const country2 = await Country.findOne({ name: 'Spain'})
  movieData.countries = []
  movieData.countries.push(country1)
  movieData.countries.push(country2)

  const genre1 = await Genre.findOne({ name: 'drama' })
  const genre2 = await Genre.findOne({ name: 'comedy' })
  movieData.genres = []
  movieData.genres.push(genre1)
  movieData.genres.push(genre2)

  const language1 = await Language.findOne({ name: 'English' })
  const language2 = await Language.findOne({ name: 'Spanish' })
  movieData.languages = []
  movieData.languages.push(language1)
  movieData.languages.push(language2)

  const result = await Movie.create(movieData)

  movieData._id = result._id

  return movieData
}

module.exports = { insertMovieInDB }