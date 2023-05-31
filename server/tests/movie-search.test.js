const { getMoviesData } = './samples/movie-find-sample.js'
const server = require('../model/Server')
const { dbDisconnect } = require('../database/config')
const Country = require('../database/models/Country')
const Language = require('../database/models/Language')
const Genre = require('../database/models/Genre')

const app = server.getApp()

beforeAll( async () => {  
  await Country.insertMany(countryData())
  await Language.insertMany(languageData())
  await Genre.insertMany(genreData())
})

afterAll(async () => {
  await dbDisconnect()
})

beforeEach( async () => {
  getMoviesData()
})

afterEach(async () => {
  await Movie.deleteMany({})
})

// describe('test movie search', () => {

//   // test('db has many movies', async () => {

//   // })

//   // test('find movie by title that does not exist, retrieve zero results', async () => {

//   // })
//   // test('find movie by title that exist, retrieve one result')
//   // test('find movie by title that exist, retrieve more than one result')

// })