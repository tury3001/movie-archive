const request = require('supertest')
const server = require('../src/model/Server')
const { dbDisconnect } = require('../src/database/config')
const Movie = require('../src/database/models/Movie')
const Genre = require('../src/database/models/Genre')
const Country = require('../src/database/models/Country')
const Language = require('../src/database/models/Language')
const { genreData } = require('../src/database/seeders/seed-genre')
const { countryData } = require('../src/database/seeders/seed-country')
const { languageData } = require('../src/database/seeders/seed-language')
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

describe('create new movie with differents sets of genres', () => {
  test('add a new movie links the movie with the country', async () => {    

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    const movie = await Movie.findOne({ title: 'Jurassic Park'} ).populate('countries')

    expect(movie.countries.length).toBe(1)
    expect(movie.countries[0].name).toBe('United States')
  })

  test('add a new movie with more than one country links the movie with every country', async () => {
    
    movieData.countries = ['Argentina', 'Spain']

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    const movie = await Movie.findOne({ title: 'Jurassic Park'} ).populate('countries')

    expect(movie.countries.length).toBe(2)
    expect(movie.countries[0].name).toBe('Argentina')
    expect(movie.countries[1].name).toBe('Spain')
  })

  test('add new movie without country', async () => {
    
    movieData.countries = []

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    const movie = await Movie.findOne({ title: 'Jurassic Park'} ).populate('countries')
    expect(movie.countries.length).toBe(0)
    
  })

  test('add new movie with a country that does not exist', async () => {
    
    movieData.countries = ['Transilvania']

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect( (res) => {
        expect(res.body.msg).toBe('Given country doesn\'t exist')
      })
  })

  test('add new movie with a duplicated country', async () => {
    
    movieData.countries = ['Argentina', 'Spain', 'Spain', 'Argentina']

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    const movie = await Movie.findOne({ title: 'Jurassic Park'} ).populate('countries')

    expect(movie.countries.length).toBe(2)
    expect(movie.countries[0].name).toBe('Argentina')
    expect(movie.countries[1].name).toBe('Spain')
  }) 
})