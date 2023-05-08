const mongoose = require('mongoose')
const request = require('supertest')
const server = require('../model/Server')
const { dbDisconnect } = require('../database/config')
const Artist = require('../database/models/Artist')
const Movie = require('../database/models/Movie')
const Country = require('../database/models/Country')
const Language = require('../database/models/Language')
const Genre = require('../database/models/Genre')
const { genreData } = require('../database/seeders/seed-genre')
const { countryData } = require('../database/seeders/seed-country')
const { languageData } = require('../database/seeders/seed-language')
const getMovieData = require('./samples/movie-data-sample')
const { getArtistData, getManyArtists } = require('./samples/artist-data-sample')

const app = server.getApp()

let movieData

beforeAll( async () => {  
  await Country.insertMany(countryData())
  await Language.insertMany(languageData())
  await Genre.insertMany(genreData())
})

afterAll(async () => {
  await dbDisconnect()
})

beforeEach( async () => {
  await insertMovieInDB()
})

afterEach(async () => {
  await Movie.deleteMany({})
})

describe('Update movie except its cast', () => {

  test('update the movie title', async () => {

    const movie = await Movie.findOne({})

    const movieData = {
      title: 'Memento'
    }

    await request(app)
          .patch(`/api/movie/${ movie._id.valueOf() }`)
          .send(movieData)
          .expect(200)
  })

})

async function insertMovieInDB () {
  movieData = getMovieData()

  let artist = getArtistData(0)
  country = await Country.findOne({ name: artist.nationality })
  artist.nationality = country._id
  const createdArtist = await Artist.create(artist)

  movieData.director = createdArtist
  
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

  await Movie.create(movieData)
}