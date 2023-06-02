const server = require('../model/Server')
const request = require('supertest')
const { dbDisconnect } = require('../database/config')
const Country = require('../database/models/Country')
const Language = require('../database/models/Language')
const Genre = require('../database/models/Genre')
const Movie = require('../database/models/Movie')
const { genreData } = require('../database/seeders/seed-genre')
const { countryData } = require('../database/seeders/seed-country')
const { languageData } = require('../database/seeders/seed-language')
const { getMoviesData } = require('./samples/movie-find-sample')
const { insertMovieInDB } = require('./utils')

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
  const movies = getMoviesData()
  await insertMovieInDB(movies[0])
  await insertMovieInDB(movies[1])
  await insertMovieInDB(movies[2])
  await insertMovieInDB(movies[3])
  await insertMovieInDB(movies[4])
})

afterEach(async () => {
  await Movie.deleteMany({})
})

describe('test movie search', () => {

  test('db has many movies', async () => {
    expect(await Movie.count({})).toBe(5)
    const movies = await Movie.find({})
    expect(movies[0].title).toBe("Jurassic Park")
    expect(movies[1].title).toBe("Blade Runner")
    expect(movies[2].title).toBe("The Godfather")
    expect(movies[3].title).toBe("The Godfather II")
    expect(movies[4].title).toBe("Blade")
  })

  test('find movie by title that does not exist, retrieve zero results', async () => {
    
    await request(app)
      .get(`/api/search/dfsdf`)
      .expect(200)
      .expect( res => {
        expect(res.body.results.length).toBe(0)
      })
  })
//   // test('find movie by title that exist, retrieve one result')
//   // test('find movie by title that exist, retrieve more than one result')

})