const request = require('supertest')
const server = require('../model/Server')
const { dbDisconnect } = require('../database/config')
const Movie = require('../database/models/Movie')
const Country = require('../database/models/Country')
const { countryData } = require('../database/seeders/seed-country')

const app = server.getApp()

beforeAll( async () => {
  await Country.insertMany(countryData())
})

afterAll(async () => {
  await dbDisconnect()
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
    const movieData = getMovieData()
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
    const movieData = getMovieData()
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
    const movieData = getMovieData()
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
    const movieData = getMovieData()
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
    const movieData = getMovieData()
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
    const movieData = getMovieData()
    movieData.director = ''

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    expect(await Movie.count()).toBe(1)
  })

  test('add new movie with a director string longer than 60 characters', async () => {
    const movieData = getMovieData()
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
    const movieData = getMovieData()
    movieData.genres = []

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    expect(await Movie.count()).toBe(1)
  })

  test('add new movie with empty genres', async () => {
    const movieData = getMovieData()
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
    const movieData = getMovieData()
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
    const movieData = getMovieData()
    movieData.synopsis = ''

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    expect(await Movie.count()).toBe(1)
  })

  test('add new movie with invalid synopsis', async () => {
    const movieData = getMovieData()
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
    const movieData = getMovieData()
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
    const movieData = getMovieData()
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
    const movieData = getMovieData()
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
    const movieData = getMovieData()
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
    const movieData = getMovieData()
    movieData.tags = []

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    expect(await Movie.count()).toBe(1)
  })

  test('add new movie with invalid tags', async () => {
    const movieData = getMovieData()
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
    const movieData = getMovieData()
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
    const movieData = getMovieData()
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
    const movieData = getMovieData()
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
    const movieData = getMovieData()

    await request(app)
      .post('/api/movie')
      .send(movieData)
      .expect(201)

    const movie = await Movie.findOne({ title: 'Jurassic Park'} ).populate('countries')

    expect(movie.countries.length).toBe(1)
    expect(movie.countries[0].name).toBe('United States')
  })

  test('add a new movie with more than one country links the movie with every country', async () => {
    const movieData = getMovieData()
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

  // test('add new movie without country')
  // test('add new movie with a country does not exist')
  // test('add new movie with a duplicated country')

  function getMovieData () {
    return {
      title: 'Jurassic Park',
      year: 1993,
      director: 'Steven Spielberg',
      genres: ['adventure', 'sci-fi'],
      countries: ['United States'],
      languages: ['english'],
      synopsis: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat qui quis est quibusdam architecto harum provident aspernatur odit. Iste id unde asperiores modi ea quam ab nulla aliquid odio! Maxime.',
      comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam cumque quod vel minima fuga eligendi fugit amet, voluptatem id omnis corporis.',
      tags: ['classic', 'film-noir']
    }
  }
})
