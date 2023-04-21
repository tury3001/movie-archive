const request = require('supertest')
const server = require('../model/Server')
const { dbDisconnect } = require('../database/config')
const Movie = require('../database/models/Movie')
const Country = require('../database/models/Country')
const Language = require('../database/models/Language')
const { countryData } = require('../database/seeders/seed-country')
const { languageData } = require('../database/seeders/seed-language')
const getMovieData = require('./samples/movie-data-sample')

const app = server.getApp()

let movieData

beforeAll( async () => {  
  await Country.insertMany(countryData())
  await Language.insertMany(languageData())
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

describe('add movie tests', () => {
  test('add new movie with all fields ok', async () => {
    await request(app)
      .post('/api/movie')
      .send(getMovieData())
      .expect(201)

    expect(await Movie.count({})).toBe(1)
  })

  test('add new movie with empty title', async () => {
    
    movieData.title = ''

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].msg).toEqual('Title can\'t be empty')
      })

    expect(await Movie.count()).toBe(0)
  })

  test('add new movie with a title greater than the max limit', async () => {
    
    movieData.title = 'E'.repeat(81)

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].msg).toEqual('Title can\'t be longer than 80 characters')
      })

    expect(await Movie.count()).toBe(0)
  })

  test('add new movie with empty year', async () => {
    
    movieData.year = null

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].msg).toEqual('Year can\'t be empty')
      })

    expect(await Movie.count()).toBe(0)
  })

  test('add new movie with non numeric year', async () => {
    
    movieData.year = 'this is not a year'

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].msg).toEqual('The year must be a number between 1895 and 3000')
      })

    expect(await Movie.count()).toBe(0)
  })

  test('add new movie with a year less than 1895', async () => {
    
    movieData.year = 1894

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].msg).toEqual('The year must be a number between 1895 and 3000')
      })

    expect(await Movie.count()).toBe(0)
  })

  test('add new movie with empty director', async () => {
    
    movieData.director = ''

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    expect(await Movie.count()).toBe(1)
  })

  test('add new movie with a director string longer than 60 characters', async () => {
    
    movieData.director = 'E'.repeat(81)

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].msg).toEqual('The director\'s name can\'t have more than 80 characters')
      })

    expect(await Movie.count()).toBe(0)
  })

  test('add new movie with empty set of genres', async () => {
    
    movieData.genres = []

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    expect(await Movie.count()).toBe(1)
  })

  test('add new movie with empty genres', async () => {
    
    movieData.genres = ['western', null]

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].msg).toEqual('Given genres are invalid')
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
        expect(res.body.errors[0].msg).toEqual('Given genres are invalid')
      })

    expect(await Movie.count()).toBe(0)
  })

  test('add new movie with empty synopsis', async () => {
    
    movieData.synopsis = ''

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    expect(await Movie.count()).toBe(1)
  })

  test('add new movie with invalid synopsis', async () => {
    
    movieData.synopsis = { some: 'thing' }

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].msg).toEqual('Given synopsis is invalid')
      })

    expect(await Movie.count()).toBe(0)
  })

  test('add new movie with synopsis that has more than 512 characters', async () => {
    
    movieData.synopsis = 's'.repeat(513)

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].msg).toEqual('Synopsis can\'t have more than 512 characters')
      })

    expect(await Movie.count()).toBe(0)
  })

  test('add new movie with empty comment', async () => {
    
    movieData.comment = ''

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    expect(await Movie.count()).toBe(1)
    const movieAdded = await Movie.find({ title: 'Jurassic Park' })
    expect(movieAdded[0].director).toBe('Steven Spielberg')
  })

  test('add new movie with invalid comment', async () => {
    
    movieData.comment = { some: 'thing ' }

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].msg).toEqual('Given comment is invalid')
      })

    expect(await Movie.count()).toBe(0)
  })

  test('add new movie with comment that has more than 512 characters', async () => {
    
    movieData.comment = 'r'.repeat(513)

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].msg).toEqual('Comment can\'t have more than 512 characters')
      })

    expect(await Movie.count()).toBe(0)
  })

  test('add new movie with empty tags', async () => {
    
    movieData.tags = []

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    expect(await Movie.count()).toBe(1)
  })

  test('add new movie with invalid tags', async () => {
    
    movieData.tags = { some: 'data' }

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].msg).toEqual('Given tags are invalid')
      })

    expect(await Movie.count()).toBe(0)
  })

  test('add new movie with a tag which type is invalid', async () => {
    
    movieData.tags = [2432, { asdas: 'asd' }]

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].msg).toEqual('There are invalid tags')
      })

    expect(await Movie.count()).toBe(0)
  })

  test('add new movie with one or more empty tags', async () => {
    
    movieData.tags = ['classic', '']

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].msg).toEqual('A tag can\'t be empty')
      })

    expect(await Movie.count()).toBe(0)
  })

  test('add new movie with a tag with more than 60 characters', async () => {
    
    movieData.tags = ['classic', 's'.repeat(61)]

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].msg).toEqual('Tags can\'t have more than 60 characters each')
      })

    expect(await Movie.count()).toBe(0)
  })

  test('add a new movie links the movie with the country', async () => {    

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    const movie = await Movie.findOne({ title: 'Jurassic Park'} ).populate('countries')

    expect(movie.countries.length).toBe(1)
    expect(movie.countries[0].name).toBe('United States')
  })

  test('add a new movie with more than one country links the movie with every country', async () => {
    
    movieData.countries = ['Argentina', 'Spain']

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    const movie = await Movie.findOne({ title: 'Jurassic Park'} ).populate('countries')

    expect(movie.countries.length).toBe(2)
    expect(movie.countries[0].name).toBe('Argentina')
    expect(movie.countries[1].name).toBe('Spain')
  })

  test('add new movie without country', async () => {
    
    movieData.countries = []

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    const movie = await Movie.findOne({ title: 'Jurassic Park'} ).populate('countries')
    expect(movie.countries.length).toBe(0)
    
  })

  test('add new movie with a country that does not exist', async () => {
    
    movieData.countries = ['Transilvania']

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect( (res) => {
        expect(res.body.message).toBe('Given country doesn\'t exist')
      })
  })

  test('add new movie with a duplicated country', async () => {
    
    movieData.countries = ['Argentina', 'Spain', 'Spain', 'Argentina']

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    const movie = await Movie.findOne({ title: 'Jurassic Park'} ).populate('countries')

    expect(movie.countries.length).toBe(2)
    expect(movie.countries[0].name).toBe('Argentina')
    expect(movie.countries[1].name).toBe('Spain')
  })

  test('add new movie without language', async () => {
    
    movieData.languages = []

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)
  })

  test('add new movie with one language', async () => {    
    
    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    const movie = await Movie.findOne({ title: 'Jurassic Park' }).populate('languages')
    expect(movie.languages.length).toBe(1)
    expect(movie.languages[0].name).toBe('English')
    expect(movie.languages[0].code).toBe('en')
  })

  test('add new movie with multiple languages', async () => {

    movieData.languages = ['English', 'French']
    
    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    const movie = await Movie.findOne({ title: 'Jurassic Park' }).populate('languages')
    expect(movie.languages.length).toBe(2)
    expect(movie.languages[0].name).toBe('English')
    expect(movie.languages[1].name).toBe('French')

  })

  test('add new movie with duplicated languages', async () => {
    
    movieData.languages = ['English', 'Spanish', 'English', 'Spanish', 'French']

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    const movie = await Movie.findOne({ title: 'Jurassic Park'} ).populate('languages')

    expect(movie.languages.length).toBe(3)
    expect(movie.languages[0].name).toBe('English')
    expect(movie.languages[1].name).toBe('Spanish')
    expect(movie.languages[2].name).toBe('French')
  })

  test('add new movie with duplicated languages', async () => {
    
    movieData.languages = ['Ergllish']

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(400)
      .expect( (res) => {
        expect(res.body.message).toBe('Given language doesn\'t exist')
      })
  })  
})
