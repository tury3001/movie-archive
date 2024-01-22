const request = require('supertest')
const server = require('../model/Server')
const { dbDisconnect } = require('../database/config')
const Movie = require('../database/models/Movie')
const Genre = require('../database/models/Genre')
const Country = require('../database/models/Country')
const Language = require('../database/models/Language')
const { genreData } = require('../database/seeders/seed-genre')
const { countryData } = require('../database/seeders/seed-country')
const { languageData } = require('../database/seeders/seed-language')
const getMovieData = require('./samples/movie-data-sample')

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

beforeEach(() => {
  movieData = getMovieData()
})

afterEach(async () => {
  await Movie.deleteMany({})
})

describe('create new movie with differents sets of languages', () => {

  test('add new movie without language', async () => {
    
    movieData.languages = []

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)
  })

  test('add new movie with one language', async () => {    
    
    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    const movie = await Movie.findOne({ title: 'Jurassic Park' }).populate('languages')
    expect(movie.languages.length).toBe(1)
    expect(movie.languages[0].name).toBe('English')
    expect(movie.languages[0].code).toBe('en')
  })

  test('add new movie with multiple languages', async () => {

    movieData.languages = ['English', 'French']
    
    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    const movie = await Movie.findOne({ title: 'Jurassic Park' }).populate('languages')
    expect(movie.languages.length).toBe(2)
    expect(movie.languages[0].name).toBe('English')
    expect(movie.languages[1].name).toBe('French')

  })

  test('add new movie with duplicated languages', async () => {
    
    movieData.languages = ['English', 'Spanish', 'English', 'Spanish', 'French']

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    const movie = await Movie.findOne({ title: 'Jurassic Park'} ).populate('languages')

    expect(movie.languages.length).toBe(3)
    expect(movie.languages[0].name).toBe('English')
    expect(movie.languages[1].name).toBe('Spanish')
    expect(movie.languages[2].name).toBe('French')
  })

  test('add new movie with invalid language', async () => {
    
    movieData.languages = ['Ergllish']

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect( (res) => {
        expect(res.body.msg).toBe('Given language doesn\'t exist')
      })
  })
})