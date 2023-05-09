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
let movieId

beforeAll( async () => {  
  await Country.insertMany(countryData())
  await Language.insertMany(languageData())
  await Genre.insertMany(genreData())
})

afterAll(async () => {
  await dbDisconnect()
})

beforeEach( async () => {
  movieId = await insertMovieInDB()
})

afterEach(async () => {
  await Movie.deleteMany({})
})

describe('Update movie except its cast', () => {

  test('update movie with invalid id', async () => {

    await request(app)
          .patch(`/api/movie/invalid-id`)
          .send(movieData)
          .expect(400)
          .expect( res => {
            expect(res.body.errors[0].msg).toBe('Given id is invalid')
          })
  })

  test('update unexistent movie', async () => {

    const movie = await Movie.findOne()
    const validId = movie._id

    await Movie.deleteMany({})

    await request(app)
      .patch(`/api/movie/${ validId }`)
      .send(movieData)
      .expect(400)
      .expect( res => {
        expect(res.body.msg).toBe('Movie does not exist')
      })
  })

  test('update the movie title', async () => {

    const movieData = {
      title: 'Memento'
    }

    await request(app)
          .patch(`/api/movie/${ movieId }`)
          .send(movieData)
          .expect(200)

    const dbMovie = await Movie.findOne()
    expect(dbMovie.title).toBe('Memento')
  })

  test('update the movie title with empty title', async () => {
    const movieData = {
      title: ''
    }

    await request(app)
      .patch(`/api/movie/${ movieId }`)
      .send(movieData)
      .expect(400)
      .expect(res => {
        expect(res.body.errors[0].msg).toBe('Title can\'t be empty')
      })
  })

  test('update the movie title with more than 80 chars', async () => {
    const movieData = {
      title: 'M'.repeat(81)
    }

    await request(app)
      .patch(`/api/movie/${ movieId }`)
      .send(movieData)
      .expect(400)
      .expect(res => {
        expect(res.body.errors[0].msg).toBe('Title can\'t be longer than 80 characters')
      })
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

  const result = await Movie.create(movieData)

  return result._id
}