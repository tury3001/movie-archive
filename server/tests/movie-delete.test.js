const request = require('supertest')
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

  // 
  // test delete movie with valid id but unexistent movie should return an error
  // test delete movie with valid id and existent movie
  // test delete movie should not delete associated cast
  // test delete movie should not delete the director
  // test delete movie should not delete genres
  // test delete movie should not delete countries
  // test delete movie should not delete languages

})