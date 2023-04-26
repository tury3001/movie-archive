const request = require('supertest')
const server = require('../model/Server')
const { dbDisconnect } = require('../database/config')
const Movie = require('../database/models/Movie')
const Genre = require('../database/models/Genre')
const Country = require('../database/models/Country')
const Language = require('../database/models/Language')
const Artist = require('../database/models/Artist')

const { genreData } = require('../database/seeders/seed-genre')
const { countryData } = require('../database/seeders/seed-country')
const { languageData } = require('../database/seeders/seed-language')

const getMovieData = require('./samples/movie-data-sample')
const { getManyArtists, getArtistData } = require('./samples/artist-data-sample')

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
  await Artist.deleteMany({})
})

describe('create new movie with differents sets of artists as cast and director', () => {

  test('create movie with existing director', async () => {

    const artist = await Artist.create( getManyArtists()[2] )
    const movieData = getMovieData()

    movieData.director = artist._id.valueOf()

    await request(app)
      .post('/api/movie')
      .send(movieData)      
      .expect(201)

    const createdMovie = await Movie.findOne().populate('director')

    expect(createdMovie.director.name).toBe('Christopher Nolan')
    expect(createdMovie.director.bornPlace).toBe('London, United Kingdom')
  })

  test('create movie with empty director', async () => {

    const movieData = getMovieData()

    await request(app)
      .post('/api/movie')
      .send(movieData)      
      .expect(201)

    const createdMovie = await Movie.findOne().populate('director')
    expect(createdMovie.director).toBeNull()
  })

  test('create movie with valid artist id but nonexistent director', async () => {

    const artist = await Artist.create(getManyArtists()[2])
    const artistId = artist._id.valueOf()

    const movieData = getMovieData()
    
    await Artist.findByIdAndDelete(artistId)
    movieData.director = artistId

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect( res => {
        expect(res.body.msg).toBe('Given director doesn\'t exist')
      })
  })

  test('create movie with invalid id for director', async () => {

    const movieData = getMovieData()
    movieData.director = 'invalid_id'

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('Invalid id for director')
      })
  })

  test('create movie with missing cast', async () => {
    const movieData = getMovieData()
    movieData.cast = null

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)
  })

  test('create movie with empty cast', async () => {
    const movieData = getMovieData()
    movieData.cast = []

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)
  })

    test('create movie with one artist in cast', async () => {
      const artist = await Artist.create(getArtistData())

      const movieData = getMovieData()
      movieData.cast.push(artist._id)

      await request(app)
        .post('/api/movie')
        .send(movieData)
        .expect(201)
        
      const insertedMovie = await Movie.findOne({ title: 'Jurassic Park' }).populate('cast')
      expect(insertedMovie.cast.length).toBe(1)
    })
 
  test('create movie with many artist in cast', async () => {
    const artist1 = await Artist.create(getManyArtists()[0])
    const artist2 = await Artist.create(getManyArtists()[1])
    const artist3 = await Artist.create(getManyArtists()[2])

    const movieData = getMovieData()
    movieData.cast.push(artist1._id)
    movieData.cast.push(artist2._id)
    movieData.cast.push(artist3._id)

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    const insertedMovie = await Movie.findOne({ title: 'Jurassic Park'}).populate('cast')
    expect(insertedMovie.cast.length).toBe(3)
  })

  test('create movie with invalid artists ids in cast', async () => {
    const movieData = getMovieData()
    movieData.cast.push('invalid-id')
    movieData.cast.push(4875)

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
  })

  test('create movie with valid artists ids but with unexistent artist in db', async () => {
    const artist1 = await Artist.create(getManyArtists()[0])
    const artist2 = await Artist.create(getManyArtists()[1])
    const artist3 = await Artist.create(getManyArtists()[2])

    const movieData = getMovieData()
    movieData.cast.push(artist1._id)
    movieData.cast.push(artist2._id)
    movieData.cast.push(artist3._id)

    await Artist.findByIdAndDelete(artist2._id)

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
  })
})