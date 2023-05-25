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

  const artist1 = getArtistData(2)
  artist1.nationality = await Country.findOne({ name: artist1.nationality })._id
  await Artist.create(artist1)

  const artist2 = getArtistData(1)
  artist2.nationality = await Country.findOne({ name: artist2.nationality })._id
  await Artist.create(artist2)

  const movie = await Movie.findById(movieData._id).populate('cast')
  movie.cast.push(artist1)
  movie.cast.push(artist2)
  await movie.save()
})

afterEach(async () => {
  await Movie.deleteMany({})
  await Artist.deleteMany({})
})

describe('remove an artist from the movie cast', () => {
  test('remove an artist with invalid artist id', async () => {

     await request(app)
       .patch(`/api/artist/remove/invalid-id/movie/${ movieData._id.toString() }`)
       .expect(400)
       .expect( res => {
          expect(res.body.errors[0].msg).toBe('Artist id is invalid')
       })
  })

  test('remove an artist with invalid movie id', async () => {

    const validId = new mongoose.Types.ObjectId()

    await request(app)
      .patch(`/api/artist/remove/${ validId.toString() }/movie/invalid-id`)
      .expect(400)
      .expect( res => {
         expect(res.body.errors[0].msg).toBe('Movie id is invalid')
      })
  })

  test('remove an unexistent artist from a movie cast', async () => {

    const validId = new mongoose.Types.ObjectId()

    await request(app)
      .patch(`/api/artist/remove/${ validId.toString() }/movie/${ movieData._id.toString() }`)
      .expect(400)
      .expect( res => {
        expect(res.body.msg).toBe('Given artist does not exist')
      })
  })

  test('remove an artist from an unexistent movie cast', async () => {

    const artist = getArtistData(2)
    artist.nationality = await Country.findOne({ name: artist.nationality })._id
    const createdArtist = await Artist.create(artist)

    const validId = new mongoose.Types.ObjectId()

    await request(app)
      .patch(`/api/artist/remove/${ createdArtist._id.toString() }/movie/${ validId.toString() }`)
      .expect(400)
      .expect( res => {
        expect(res.body.msg).toBe('Given movie does not exist')
      })
  })
})