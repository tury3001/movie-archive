const request = require('supertest')
const mongoose = require('mongoose')
const server = require('../model/Server')
const Artist = require('../database/models/Artist')
const Movie = require('../database/models/Movie')
const Country = require('../database/models/Country')
const Language = require('../database/models/Language')
const Genre = require('../database/models/Genre')
const { genreData } = require('../database/seeders/seed-genre')
const { countryData } = require('../database/seeders/seed-country')
const { languageData } = require('../database/seeders/seed-language')
const { insertMovieInDB } = require('./utils')
const { dbDisconnect } = require('../database/config')
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

describe('add new artist to movie cast tests', () => {
  test('add invalid artist to a valid movie', async () => {

    const artist = getArtistData(2)
    artist.nationality = await Country.findOne({ name: artist.nationality })._id
    await Artist.create(artist)

     await request(app)
       .patch(`/api/artist/add/invalid-id/movie/${ movieData._id.toString() }`)
       .expect(400)
       .expect( res => {
          expect(res.body.errors[0].msg).toBe('Artist id is invalid')
       })
   })

  test('add unexistent artist to a valid movie', async () => {
    const validId = new mongoose.Types.ObjectId()

    await request(app)
      .patch(`/api/artist/add/${ validId }/movie/${ movieData._id.toString() }`)
      .expect(400)
      .expect( res => {
        expect(res.body.msg).toBe('Given artist does not exist')
      })
  })

  test('add existent artist to an invalid movie', async () => {

    const artist = getArtistData(2)
    artist.nationality = await Country.findOne({ name: artist.nationality })._id
    const newArtist = await Artist.create(artist)

    await request(app)
      .patch(`/api/artist/add/${ newArtist._id.toString() }/movie/invalid-movie`)
      .expect(400)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('Movie id is invalid')
      })      
  })

  test('add existent artist to an unexistent movie', async () => {
    const validId = new mongoose.Types.ObjectId()

    const artist = getArtistData(2)
    artist.nationality = await Country.findOne({ name: artist.nationality })._id
    const newArtist = await Artist.create(artist)

    await request(app)
      .patch(`/api/artist/add/${ newArtist._id.toString() }/movie/${ validId }`)
      .expect(400)
      .expect( res => {
        expect(res.body.msg).toBe('Given movie does not exist')
      })
  })

  test('add one artist to movie cast', async () => {

    const artist = getArtistData(2)
    artist.nationality = await Country.findOne({ name: artist.nationality })._id
    const newArtist = await Artist.create(artist)

    const movie = await Movie.findById(movieData._id.toString()).populate('cast')
    expect(movie.cast.length).toBe(0)

    await request(app)
      .patch(`/api/artist/add/${ newArtist._id.toString() }/movie/${ movie._id.toString() }`)
      .expect(200)

    const dbMovie = await Movie.findById(movieData._id.toString()).populate('cast')
    expect(dbMovie.cast.length).toBe(1)
  })

  test('add artist repeated artist to cast must not be possible', async () => {

    const artist = getArtistData(0)
    artist.nationality = await Country.findOne({ name: artist.nationality })._id
    const newArtist = await Artist.create(artist)

    const movie = await Movie.findById(movieData._id)
    movie.cast.push(newArtist)
    await movie.save()
    expect(movie.cast.length).toBe(1)

    await request(app)
      .patch(`/api/artist/add/${ newArtist._id.toString() }/movie/${ movie._id.toString() }`)
      .expect(400)
      .expect( res => {
        expect(res.body.msg).toBe('The artist is already part of the cast')
      })

    const unafectedMovie = await Movie.findById(movieData._id)
    expect(unafectedMovie.cast.length).toBe(1)
  })

})