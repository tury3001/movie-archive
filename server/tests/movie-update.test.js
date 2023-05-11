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
  await Artist.deleteMany({})
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
      .expect(200)

    const movie = await Movie.findById(movieId)
    expect(movie.title).toBe('Jurassic Park')
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

  test('update the movie year', async () => {
    const movieData = {
      year: 1999
    }

    await request(app)
      .patch(`/api/movie/${ movieId }`)
      .send(movieData)
      .expect(200)

    const movie = await Movie.findById(movieId)
    expect(movie.year).toBe(1999)
  })

  test('update the movie with invalid year value', async () => {
    const movieData = {
      year: 'invalid-year'
    }

    await request(app)
      .patch(`/api/movie/${ movieId }`)
      .send(movieData)
      .expect(400)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('The year must be a number between 1895 and 3000')
      })      
  })

  test('update the movie with out of range year', async () => {
    const movieData = {
      year: 8938
    }

    await request(app)
      .patch(`/api/movie/${ movieId }`)
      .send(movieData)
      .expect(400)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('The year must be a number between 1895 and 3000')
      })      
  })

  test('update movie with invalid director', async () => {

    const movieData = {
      director: 'not-valid-director'
    }

    await request(app)
      .patch(`/api/movie/${ movieId }`)
      .send(movieData)
      .expect(400)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('Invalid id for director')
      })  
  })

  test('update movie with empty director', async () => {
    const movieData = {
      director: null
    }

    await request(app)
      .patch(`/api/movie/${ movieId }`)
      .send(movieData)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('Invalid id for director')
      })
  })

  test('update movie with valid director', async () => {

    let artist = getArtistData(1)
    country = await Country.findOne({ name: artist.nationality })
    artist.nationality = country._id

    const createdArtist = await Artist.create(artist)

    movieData.director = createdArtist._id.toString()

    await request(app)
      .patch(`/api/movie/${ movieId }`)
      .send(movieData)
      .expect(200)

    const movie = await Movie.findById(movieId).populate('director')
    expect(movie.director.name).toBe('Sigourney Weaver')
  })

  test('update movie with unexistent director', async () => {

    let artist = getArtistData(1)
    country = await Country.findOne({ name: artist.nationality })
    artist.nationality = country._id

    const createdArtist = await Artist.create(artist)
    const createdArtistId = createdArtist._id.toString()
    await Artist.deleteOne({ _id: createdArtistId })

    movieData.director = createdArtistId

    await request(app)
      .patch(`/api/movie/${ movieId }`)
      .send(movieData)
      .expect(400)
  })
})

async function insertMovieInDB () {
  movieData = getMovieData()

  let artist = getArtistData(0)
  country = await Country.findOne({ name: artist.nationality })
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

  return result._id
}