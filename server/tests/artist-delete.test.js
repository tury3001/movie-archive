
const request = require('supertest')
const Artist = require('../database/models/Artist')
const Country = require('../database/models/Country')
const Movie = require('../database/models/Movie')
const Server = require('../model/Server')

const { getArtistData } = require('./samples/artist-data-sample')
const getMovieData = require('./samples/movie-data-sample')
const { countryData } = require('../database/seeders/seed-country')

const { dbDisconnect } = require('../database/config')

const app = Server.getApp()

beforeAll(async () => {
  await Country.insertMany(countryData())
})

afterAll(async () => {
  await dbDisconnect()
})

afterEach(async () => {
  await Artist.deleteMany({})
  await Movie.deleteMany({})
})

describe('delete artist tests', () => {

  test('delete an artist that is not in a movie', async () => {

    const { _id } = await insertArtist(0)
    
    expect(await Artist.count()).toBe(1)

    await request(app)
      .delete(`/api/artist/${ _id }`)
      .expect(200)

    expect(await Artist.count()).toBe(0)
  })

  test('delete an artist with invalid id', async () => {
    await request(app)
      .delete(`/api/artist/jd837fjdnf`)
      .expect(400)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('Given id is invalid')
      })
  })

  test('delete an artist that does not exist', async () => {

    const { _id } = await insertArtist(0)
    await Artist.deleteOne({ _id })

    expect(await Artist.count()).toBe(0)
    
    await request(app)
      .delete(`/api/artist/${ _id }`)
      .expect(400)
      .expect( res => {
        expect(res.body.msg).toBe('Artist does not exist')
      })
  })

  test('delete an artist that is a director in a movie', async () => {
    const artistId = await insertArtist(0)
    const movieData = getMovieData()
    
    movieData.languages = []
    movieData.countries = []
    movieData.genres = [] 
    movieData.director = artistId

    await Movie.create(movieData)

    await request(app)
      .delete(`/api/artist/${ artistId }`)
      .expect(200)

    const movie = await Movie.findOne({})
    expect(movie.director).toBeNull()
    expect(await Artist.count()).toBe(0)
    expect(await Movie.count()).toBe(1)
  })

  test('delete an artist that is a director in three movies', async () => {
    const artistId = await insertArtist(0)
    let movieData = getMovieData()

    movieData.cast = []
    
    for (let i=1; i <= 3; i++) {
      
      movieData.languages = []
      movieData.countries = []
      movieData.genres = [] 
      movieData.director = artistId

      await Movie.create(movieData)
    }

    expect(await Movie.count()).toBe(3)

    await request(app)
      .delete(`/api/artist/${ artistId }`)
      .expect(200)
    
    const movies = await Movie.find({})
    
    expect(await Artist.count()).toBe(0)
    expect(movies[0].director).toBeNull()
    expect(movies[1].director).toBeNull()
    expect(movies[2].director).toBeNull()
    
  })
})

async function insertArtist (n) {
  const artist = getArtistData(n)
  artist.nationality = await Country.findOne({ name: artist.nationality })._id
  const { _id } = await Artist.create(artist)
  return _id;
}