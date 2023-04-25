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

describe('create new movie with differents sets of genres', () => {

  test('add new movie with empty set of genres', async () => {
    
    movieData.genres = []

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    expect(await Movie.count()).toBe(1)
  })

  test('add new movie with an empty genre', async () => {
    
    movieData.genres = ['western', null]

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('Given genre doesn\'t exist')
      })

    expect(await Movie.count()).toBe(0)
  })

  test('add new movie with invalid genres', async () => {
    
    movieData.genres = [4233, 12]

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('Given genre doesn\'t exist')
      })

    expect(await Movie.count()).toBe(0)
  })

   test('add new movie with one genre', async () => {
      movieData.genres = ['drama']

      await request(app)
        .post('/api/movie')
        .send(movieData)
        .expect(201)

      expect(await Movie.count()).toBe(1)
      const movie = await Movie.findOne({ title: 'Jurassic Park'}).populate('genres')
      expect(movie.genres.length).toBe(1)
   })

  test('add new movie with multiple genres', async () => {
    movieData.genres = ['drama' , 'comedy', 'action']

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    expect(await Movie.count()).toBe(1)
    const movie = await Movie.findOne({ title: 'Jurassic Park'}).populate('genres')
    expect(movie.genres.length).toBe(3)
  })

  test('add new movie with duplicated genres', async () => {
    movieData.genres = ['drama', 'comedy', 'action', 'comedy', 'action', 'action']

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    expect(await Movie.count()).toBe(1)
    const movie = await Movie.findOne({ title: 'Jurassic Park'}).populate('genres')
    expect(movie.genres.length).toBe(3)
  })

  test('add new movie with nonexistent genre', async () => {
    
    movieData.genres = ['drama', 'opera']

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('Given genre doesn\'t exist')
      })

    expect(await Movie.count()).toBe(0)
  })

})