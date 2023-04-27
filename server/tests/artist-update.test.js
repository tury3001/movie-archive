const request = require('supertest')
const server = require('../model/Server')
const Country = require('../database/models/Country')
const Artist = require('../database/models/Artist')
const { dbDisconnect } = require('../database/config')
const { countryData } = require('../database/seeders/seed-country')
const { getArtistData } = require('./samples/artist-data-sample')

const app = server.getApp()

let artistId

beforeAll( async () => {
    await Country.insertMany(countryData())
})

beforeEach( async () => {
    let artistData = getArtistData()
    artistData.country = Country.findOne({ name: artistData.nationality})
    const { _id } = await Artist.create(artistData)
    artistId = _id.toString()
})

afterAll( async () => {
    await dbDisconnect()
})

describe('update artist tests', () => {
    test('update artist name with valid data', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ name: 'William Shatner' })
            .expect(204)

        const artist = await Artist.findById(artistId).populate('nationality')
        expect(artist.name).toBe('William Shatner')
        expect(artist.bornPlace).toBe('Mirfield, United Kingdom')
      //  expect(artist.nationality.name).toBe('England')
    })

    test('update artist name with empty data', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ name: ''})
            .expect(400)

    })
})