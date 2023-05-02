
const request = require('supertest')
const Artist = require('../database/models/Artist')
const Country = require('../database/models/Country')
const Server = require('../model/Server')

const { getArtistData } = require('./samples/artist-data-sample')
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
})

describe('delete artist tests', () => {

  test('delete an artist that is not in a movie', async () => {

    const artist = getArtistData()
    artist.nationality = await Country.findOne({ name: artist.nationality })._id

    const { _id } = await Artist.create(artist)
    
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

    const artist = getArtistData()
    artist.nationality = await Country.findOne({ name: artist.nationality })._id

    const { _id } = await Artist.create(artist)
    await Artist.deleteOne({ _id })

    expect(await Artist.count()).toBe(0)
    
    await request(app)
      .delete(`/api/artist/${ _id }`)
      .expect(400)
      .expect( res => {
        expect(res.body.msg).toBe('Artist does not exist')
      })
  })
})