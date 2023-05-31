const request = require('supertest')
const server = require('../model/Server')
const { dbDisconnect } = require('../database/config')
const Artist = require('../database/models/Artist')
const Movie = require('../database/models/Movie')
const Country = require('../database/models/Country')
const Language = require('../database/models/Language')
const Genre = require('../database/models/Genre')
const { genreData } = require('../database/seeders/seed-genre')
const { countryData } = require('../database/seeders/seed-country')
const { languageData } = require('../database/seeders/seed-language')
const getMovieData = require('./samples/movie-data-sample')
const { getArtistData } = require('./samples/artist-data-sample')
const { insertMovieInDB } = require('./utils')

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

describe('Update movie except its cast', () => {

  test('update movie with invalid id', async () => {

    await request(app)
          .patch(`/api/movie/invalid-id`)
          .send(movieData)
          .expect(400)
          .expect( res => {
            expect(res.body.errors[0].msg).toBe('Given id is invalid')
          })
  })

  test('update unexistent movie', async () => {

    const movie = await Movie.findOne()
    const validId = movie._id

    await Movie.deleteMany({})

    await request(app)
      .patch(`/api/movie/${ validId }`)
      .send(getMovieData())
      .expect(400)
      .expect( res => {
        expect(res.body.msg).toBe('Movie does not exist')
      })
  })

  test('update the movie title', async () => {

    const data = {
      title: 'Memento'
    }

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id)
    expect(movie.title).toBe('Memento')
  })

  test('update the movie title with empty title', async () => {
    const data = {
      title: ''
    }

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id)
    expect(movie.title).toBe('Jurassic Park')
  })

  test('update the movie with no title', async () => {
    const data = { year: 1988, countries: ['Spain', 'Sweden'] }

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id)
    expect(movie.title).toBe('Jurassic Park')
  })

  test('update the movie title with more than 80 chars', async () => {
    const data = {
      title: 'M'.repeat(81)
    }

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(400)
      .expect(res => {
        expect(res.body.errors[0].msg).toBe('Title can\'t be longer than 80 characters')
      })
  })

  test('update the movie year', async () => {
    const data = {
      year: 1999
    }

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id)
    expect(movie.year).toBe(1999)
  })

  test('update the movie with invalid year value', async () => {
    const data = {
      year: 'invalid-year'
    }

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(400)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('The year must be a number between 1895 and 3000')
      })      
  })

  test('update the movie with out of range year', async () => {
    const data = {
      year: 8938
    }

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(400)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('The year must be a number between 1895 and 3000')
      })      
  })

  test('update the movie with no year', async () => {
    const data = { title: 'Antoher movie', countries: ['Argentina', 'Uruguay'] }

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

      const movie = await Movie.findById(movieData._id)
      expect(movie.year).toBe(1993)
  })

  test('update movie with invalid director', async () => {

    const data = {
      director: 'not-valid-director'
    }

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(400)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('Invalid id for director')
      })  
  })

  test('update movie with empty director is possible', async () => {
    const data = { title: 'Back to the Future', year: 1985 }

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id).populate('director')
    expect(movie.director.name).toBe('Patrick Stewart')
  })

  test('update movie with valid director', async () => {

    let artist = getArtistData(1)
    country = await Country.findOne({ name: artist.nationality })
    artist.nationality = country._id

    const createdArtist = await Artist.create(artist)

    let data = getMovieData()
    data.director = createdArtist._id.toString()

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id).populate('director')
    expect(movie.director.name).toBe('Sigourney Weaver')
  })

  test('update movie with unexistent director', async () => {

    let artist = getArtistData(1)
    country = await Country.findOne({ name: artist.nationality })
    artist.nationality = country._id

    const createdArtist = await Artist.create(artist)
    const createdArtistId = createdArtist._id.toString()
    await Artist.deleteOne({ _id: createdArtistId })

    movieData.director = createdArtistId

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(movieData)
      .expect(400)
  })

  test('update movie with valid synopsis', async () => {

    let data = getMovieData()
    data.synopsis = 'Valid synopsis'

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id)
    expect(movie.synopsis).toBe('Valid synopsis')
  })

  test('update movie with empty synopsis it should clear the current synopsis', async () => {

    let data = getMovieData()
    data.synopsis = ''

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id)
    expect(movie.synopsis).toBe('')
  })

  test('update movie with null synopsis should not update the synopsis', async () => {

    let data = getMovieData()
    const beforeSynopsis = data.synopsis
    data.synopsis = null

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id)
    expect(movie.synopsis).toBe(beforeSynopsis)
  })

  test('update movie with synopsis length greater than 512 characters', async () => {

    movieData.synopsis = 's'.repeat(513)

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(movieData)
      .expect(400)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('Synopsis can\'t have more than 512 characters')
      })
  })

  test('update movie with invalid symbols', async () => {

    movieData.synopsis = 'This synopsis has s&+@#$ge symbols'

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(movieData)
      .expect(400)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('Synopsis should contain only alphanumeric and puntuaction characters')
      })
  })

  test('update movie with missing genres', async () => {
    let data = getMovieData()

    data.genres = undefined

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id).populate('genres')

    expect(movie.genres.length).toBe(2)
    expect(movie.genres[0].name).toBe('drama')
    expect(movie.genres[1].name).toBe('comedy')    
  })

  test('update movie with empty genres is possible', async () => {

    let data = getMovieData()
    data.genres = []

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id).populate('genres')
    expect(movie.genres.length).toBe(0) 
  })

  test('update movie with other genres', async () => {
    let data = getMovieData()
    data.genres = ['western', 'documentary']    

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id).populate('genres')
    expect(movie.genres.length).toBe(2)
    expect(movie.genres[0].name).toBe('western')
    expect(movie.genres[1].name).toBe('documentary')
  })

  test('update movie with no countries', async () => {
    let data = getMovieData()
    delete data['countries']

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id).populate('countries')
    expect(movie.countries.length).toBe(2)
    expect(movie.countries[0].name).toBe('Argentina')
    expect(movie.countries[1].name).toBe('Spain')
  })

  test('update movie with empty countries', async () => {
    let data = getMovieData()
    data.countries = []

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id).populate('countries')
    expect(movie.countries.length).toBe(0)
  })

  test('update movie with invalid set of countries', async () => {
    let data = getMovieData()
    data.countries = 'invalid-set-of-countries'

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(400)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('Given countries are invalid')
      })
  })

  test('update movie with nonexistent countries', async () => {
    let data = getMovieData()
    data.countries = ['Bolivia', 'Alto Volta']

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(400)
      .expect( res => {
        expect(res.body.msg).toBe('Given country doesn\'t exist')
      })
  })

  test('update movie with valid countries', async () => {
    let data = getMovieData()
    data.countries = ['Colombia', 'Nicaragua', 'Mexico']

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id).populate('countries')

    expect(movie.countries.length).toBe(3)
    expect(movie.countries[0].name).toBe('Colombia')
    expect(movie.countries[1].name).toBe('Nicaragua')
    expect(movie.countries[2].name).toBe('Mexico')
  })

  test('update movie without languages', async () => {
    let data = getMovieData()
    delete data.languages

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id).populate('languages')
    expect(movie.languages.length).toBe(2)
    expect(movie.languages[0].name).toBe('English')
    expect(movie.languages[1].name).toBe('Spanish')
  })

  test('update movie with empty languages', async () => {
    let data = getMovieData()
    data.languages = []

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id).populate('languages')
    expect(movie.languages.length).toBe(0)
  }) 
  
  test('update movie with invalid languages', async () => {
    let data = getMovieData()
    data.languages = 'invalid-languages'

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(400)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('Given languages are invalid')
      })
  })

  test('update movie with non existent languages', async () => {
    let data = getMovieData()
    data.languages = ['asirico', 'enciclico']

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(400)
      .expect( res => {
        expect(res.body.msg).toBe('Given language doesn\'t exist')
      })
  })

  test('update movie with valid languages', async () => {
    let data = getMovieData()
    data.languages = ['Basque', 'Portuguese']

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)
    
    const movie = await Movie.findById(movieData._id).populate('languages')
    expect(movie.languages.length).toBe(2)
    expect(movie.languages[0].name).toBe('Basque')
    expect(movie.languages[1].name).toBe('Portuguese')
  })
  
  test('update tags with empty tags', async () => {
    let data = { title: 'Jurassic World', year: 2020 }
    data.tags = []

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id)
    expect(movie.tags).toStrictEqual([])
  })

  test('update tags with no tags', async () => {
    let data = { title: 'Jurassic World', year: 2020 }

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(200)

    const movie = await Movie.findById(movieData._id)
    expect(movie.tags).toStrictEqual(['classic', 'film-noir'])
  })
  
  test('update tags with invalid characters in tags', async () => {
    let data = { title: 'Jurassic World', year: 2020 }
    data.tags = ['>?":{P', '@@#$#$']

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(400)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('There are invalid tags')
      })
  }) 
  
  test('update tags with too long tags', async () => {
    let data = { title: 'Jurassic World', year: 2020 }
    data.tags = [ 's'.repeat(61), 'normal']

    await request(app)
      .patch(`/api/movie/${ movieData._id.toString() }`)
      .send(data)
      .expect(400)
      .expect( res => {
        expect(res.body.errors[0].msg).toBe('Tags can\'t have more than 60 characters each')
      })
  }) 
})