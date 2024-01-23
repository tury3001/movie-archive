const request = require('supertest')
const mongoose = require('mongoose')
const server = require('../src/model/Server')
const Artist = require('../src/database/models/Artist')
const Movie = require('../src/database/models/Movie')
const Country = require('../src/database/models/Country')
const Language = require('../src/database/models/Language')
const Genre = require('../src/database/models/Genre')
const { genreData } = require('../src/database/seeders/seed-genre')
const { countryData } = require('../src/database/seeders/seed-country')
const { languageData } = require('../src/database/seeders/seed-language')
const { insertMovieInDB } = require('./utils')
const { dbDisconnect } = require('../src/database/config')
const { getArtistData } = require('./samples/artist-data-sample')
const getMovieData = require('./samples/movie-data-sample')


const app = server.getApp()
let movieData
let artist1, artist2

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

  artist1 = getArtistData(2)
  artist1.nationality = await Country.findOne({ name: artist1.nationality })._id
  artist1 = await Artist.create(artist1)

  artist2 = getArtistData(1)
  artist2.nationality = await Country.findOne({ name: artist2.nationality })._id
  artist2 = await Artist.create(artist2)

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

  test('remove an artist from a movie cast', async () => {

    const movie = await Movie.findById(movieData._id.toString()).populate('cast')
    const artistToRemove = movie.cast[1]

    await request(app)
      .patch(`/api/artist/remove/${ artistToRemove._id.toString() }/movie/${ movieData._id.toString() }`)
      .expect(200)

    const movieDb = await Movie.findById(movieData._id).populate('cast')
    expect(movieDb.cast.length).toBe(1)
    expect(movieDb.cast[0].name).toBe('Christopher Nolan')
  })

  test('remove an artist from a movie that is not part of the cast', async () => {

    let artist0 = getArtistData(0)
    artist0.nationality = await Country.findOne({ name: artist0.nationality })._id
    artist0 = await Artist.create(artist0)
    
    await request(app)
      .patch(`/api/artist/remove/${ artist0._id.toString() }/movie/${ movieData._id.toString() }`)
      .expect(400)
      .expect( res => {
        expect(res.body.msg).toBe('The artist is not in the movie cast')
      })
  })
})