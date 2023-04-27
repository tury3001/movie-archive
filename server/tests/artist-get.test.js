const request = require('supertest')
const Server = require('../model/Server')
const { dbDisconnect } = require('../database/config')
const Country = require('../database/models/Country')
const Artist = require('../database/models/Artist')
const { countryData } = require('../database/seeders/seed-country')
const { getManyArtists } = require('./samples/artist-data-sample')

const app = Server.getApp()

beforeAll(async () => {
    await Country.insertMany(countryData())
})

afterAll(async () => {
    await dbDisconnect()
})

describe('get artist tests', () => {

    test('get one artist given its correct id', async () => {

        const dataArtist = await getOneArtist(0)
        const artist = await Artist.create(dataArtist)

        await request(app).get(`/api/artist/${ artist._id }`)
            .expect(200)
            .expect( (res) => {
                expect(res.body.name).toBe('Patrick Stewart')
                expect(res.body.gender).toBe('M')
                expect(res.body.bornDate.slice(0,10)).toBe('1940-07-13')
                expect(res.body.bornPlace).toBe('Mirfield, United Kingdom')
            })
    })

    test('get one artist with invalid id', async () => {

        const dataArtist = await getOneArtist(0)
        const artist = await Artist.create(dataArtist)

        await request(app).get(`/api/artist/asdaj8374`)
            .expect(400)
            .expect( res => {
                expect(res.body.msg).toBe('Given artist doesn\'t exist')
            })
    })
})

async function getOneArtist(n) {
    const artist = getManyArtists()[n]
    artist.nationality = (await Country.findOne({ name: artist.nationality }))._id
    return artist
}