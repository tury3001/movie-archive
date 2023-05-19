const request = require('supertest')
const mongoose = require('mongoose')
const server = require('../model/Server')
const { dbDisconnect } = require('../database/config')
const Movie = require('../database/models/Movie')
const Artist = require('../database/models/Artist')
const Country = require('../database/models/Country')
const Language = require('../database/models/Language')
const Genre = require('../database/models/Genre')
const { genreData } = require('../database/seeders/seed-genre')
const { countryData } = require('../database/seeders/seed-country')
const { languageData } = require('../database/seeders/seed-language')
const { insertMovieInDB } = require('./utils')
const { getArtistData } = require('./samples/artist-data-sample')

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
  movieData = await insertMovieInDB()
})

afterEach(async () => {
  await Movie.deleteMany({})
  await Artist.deleteMany({})
})


describe('delete movie tests', () => {

  test('delete movie with invalid id it should return an error', async () => {

    await request(app)
      .delete(`/api/movie/invalid-id`)
      .expect(400)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('Given id is invalid')
      })
  })

  test('delete movie with valid id but unexistent movie should return an error', async () => {

    const id = new mongoose.Types.ObjectId()

    await request(app)
      .delete(`/api/movie/${ id.toString() }`)
      .expect(400)
      .expect( res => {
        expect(res.body.msg).toBe('Given movie does not exist')
      })
  })

  test('delete movie with valid id and existent movie', async () => {
    await request(app)
      .delete(`/api/movie/${ movieData._id.toString() }`)
      .expect(200)

    const qMovies = await Movie.count()
    expect(qMovies).toBe(0)
  })

  test('delete movie should not delete associated cast', async () => {

    let artist = getArtistData(1)
    let country = await Country.findOne({ name: artist.nationality })
    artist.nationality = country._id
    const createdArtist1 = await Artist.create(artist)

    let artist2 = getArtistData(2)
    let country2 = await Country.findOne({ name: artist2.nationality })
    artist2.nationality = country2._id
    const createdArtist2 = await Artist.create(artist2)

    const movie = await Movie.findById(movieData._id.toString())
    movie.cast.push(createdArtist1, createdArtist2)

    await movie.save()

    const savedMovie = await Movie.findById(movie._id.toString())
    expect(savedMovie.cast.length).toBe(2)
    expect(await Artist.count()).toBe(3)

    await request(app)
      .delete(`/api/movie/${ movieData._id.toString() }`)
      .expect(200)

    expect(await Artist.count()).toBe(3)
  })
  
  
  test('delete movie should not delete the director', async () => {

    const movie = await Movie.findById(movieData._id.toString()).populate('director')
    const directorId = movie.director._id.toString()
    const directorName = movie.director.name

    await request(app)
      .delete(`/api/movie/${ movieData._id.toString() }`)
      .expect(200)

    const artist = await Artist.findById(directorId)
    expect(artist.name).toBe(directorName)
  })

  test('delete movie should not delete genres', async () => {
    const movie = await Movie.findById(movieData._id.toString()).populate('genres')
    const genres = movie.genres

    await request(app)
     .delete(`/api/movie/${ movieData._id.toString() }`)
     .expect(200)

    let dbGenre
    for (genre of genres) {
      dbGenre = await Genre.findById(genre._id.toString())
      expect(dbGenre.name).toBe(genre.name)
    }
  })

  test('delete movie should not delete countries', async () => {
    const movie = await Movie.findById(movieData._id.toString()).populate('countries')
    const countries = movie.countries

    await request(app)
      .delete(`/api/movie/${ movieData._id.toString() }`)
      .expect(200)

    let dbCountry
    for (country of countries) {
      dbCountry = await Country.findById(country._id.toString())
      expect(dbCountry.name).toBe(country.name)
    }
  })

  test('delete movie should not delete languages', async () => {
    const movie = await Movie.findById(movieData._id.toString()).populate('languages')
    const languages = movie.languages

    await request(app)
      .delete(`/api/movie/${ movieData._id.toString() }`)
      .expect(200)

    let dbLanguage
    for (language of languages) {
      dbLanguage = await Language.findById(language._id.toString())
      expect(dbLanguage.name).toBe(language.name)
    }
  })
})