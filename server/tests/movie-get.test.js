const request = require('supertest')
const server = require('../model/Server')
const mongoose = require('mongoose')
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

beforeEach( async () => {
  const data = getMovieData()
  movieData = await insertMovieInDB(data)
})

afterEach(async () => {
  await Movie.deleteMany({})
  await Artist.deleteMany({})
})

describe('get movie tests', () => {

  test('get movie with invalid id should return an error', async () => {
    await request(app).get(`/api/movie/invalid-id`)
     .expect(400)
     .expect( res => {
      expect(res.body.errors[0].msg).toBe('Given id is invalid')
    })
  })

  test('get movie with valid id but unexistent movie', async () => {

    const id = new mongoose.Types.ObjectId()

    await request(app).get(`/api/movie/${ id }`)
     .expect(400)
     .expect( res => {
      expect(res.body.msg).toBe('Movie does not exist')
    })
  })
   
  test('get movie with valid id and a movie that exist in the database', async () => {
    await request(app).get(`/api/movie/${ movieData._id.toString() }`)
     .expect(200)
     .expect( res => {
        expect(res.body.title).toBe('Jurassic Park')
        expect(res.body.director.name).toBe('Patrick Stewart')
        expect(res.body.countries[0].name).toBe('Argentina')
        expect(res.body.languages[0].name).toBe('English')
        expect(res.body.genres[0].name).toBe('drama')
     })
  })
})
