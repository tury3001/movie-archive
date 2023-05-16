const request = require('supertest')
const server = require('../model/Server')
const { dbDisconnect } = require('../database/config')
const Movie = require('../database/models/Movie')
const Artist = require('../database/models/Artist')
const { genreData } = require('../database/seeders/seed-genre')
const { countryData } = require('../database/seeders/seed-country')
const { languageData } = require('../database/seeders/seed-language')
const getMovieData = require('./samples/movie-data-sample')

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


describe('delete movie tests', () => {

  

})