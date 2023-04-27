const request = require('supertest')
const server = require('../model/Server')
const Country = require('../database/models/Country')
const Artist = require('../database/models/Artist')
const { dbDisconnect } = require('../database/config')
const { countryData } = require('../database/seeders/seed-country')
const { getArtistData, getManyArtists } = require('./samples/artist-data-sample')

const app = server.getApp()

let artistId
let artistData
let country

beforeAll( async () => {
    await Country.insertMany(countryData())
    await Artist.deleteMany({})

    artistData = getArtistData()
    country = await Country.findOne({ name: artistData.nationality })
    artistData.nationality = country._id
})

beforeEach( async () => {
    const { _id } = await Artist.create(artistData)
    artistId = _id.toString()
})

afterAll( async () => {
    await dbDisconnect()
})

describe('update artist tests', () => {

    // tests with invalid _id

    test('update artist name with valid data', async () => {

        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ name: 'William Shatner' })
            .expect(204)

        const artist = await Artist.findById(artistId).populate('nationality')
        expect(artist.name).toBe('William Shatner')
        expect(artist.bornPlace).toBe('Mirfield, United Kingdom')
        expect(artist.nationality.name).toBe('United Kingdom')
    })

    test('update artist name with name that\'s empty', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ name: ''})
            .expect(400)

        const artist = await Artist.findById(artistId)
        expect(artist.name).toBe('Patrick Stewart')
        expect(artist.bornPlace).toBe('Mirfield, United Kingdom')
    })

    test('update artist name with a name greater than 60 characters', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ name: 's'.repeat(61) })
            .expect(400)
            .expect( res => {
                expect(res.body.errors[0].msg).toBe('Artist name can\'t have more than 60 characters')
            })
    })

    test('update artist with empty gender', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ gender: '' })
            .expect(400)
            .expect( res => {
                expect(res.body.errors[0].msg).toBe('Artist gender must be either F or M')
            })   
    })

    test('update artist gender with invalid gender', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ gender: 'invalid-gender' })
            .expect(400)
            .expect( res => {
                expect(res.body.errors[0].msg).toBe('Artist gender must be either F or M')
            })            
    })

    test('update artist gender from M to F', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ gender: 'F' })
            .expect(204)
            
        const artist = await Artist.findById(artistId)
        expect(artist.gender).toBe('F')
        expect(artist.bornPlace).toBe('Mirfield, United Kingdom')
    })

    test('update artist gender from F to M', async () => {

        let artistToUpdate = getManyArtists()[1]
        artistToUpdate.nationality = await Country.findOne({ name: artistToUpdate.nationality })._id

        const { _id } = await Artist.create(artistToUpdate)
        femaleArtistId = _id.toString()

        await request(app)
            .patch(`/api/artist/${ femaleArtistId }`)
            .send({ gender: 'M' })
            .expect(204)

        const artist = await Artist.findById(femaleArtistId)
        expect(artist.gender).toBe('M')
        expect(artist.bornPlace).toBe('Manhattan, New York, United States')
    })

    test('update artist with invalid date', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ bornDate: 'invalid-date' })
            .expect(400)
            .expect( res => {
                expect(res.body.errors[0].msg).toBe('Artist born date must be a valid date')
            })
    })

    test('update artist with an empty born date', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ bornDate: '' })
            .expect(204)

        const artist = await Artist.findById(artistId)
        expect(artist.bornDate).toBeNull()
        expect(artist.bornPlace).toBe('Mirfield, United Kingdom')
    })

    test('update artist changing its born date', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ bornDate: '1994-11-30' })
            .expect(204)

        const artist = await Artist.findById(artistId)
        expect(artist.bornDate.toISOString().split('T')[0]).toBe('1994-11-30')
        expect(artist.bornPlace).toBe('Mirfield, United Kingdom')
    })

    test('update artist changing its born place', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ bornPlace: 'Buenos Aires, Argentina' })
            .expect(204)

        const artist = await Artist.findById(artistId)
        expect(artist.bornPlace).toBe('Buenos Aires, Argentina')     
    })

    test('update artist with bornPlace greater than 60 characters', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ bornPlace: 'B'.repeat(61) })
            .expect(400)
            .expect( res => {
                expect(res.body.errors[0].msg).toBe('Artist born place length can\'t be greater than 60 characters')
            })       
    })

    test('update artist with empty bornPlace', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ bornPlace: '' })
            .expect(204)
            
        const artist = await Artist.findById(artistId)
        expect(artist.bornPlace).toBe('')
        expect(artist.name).toBe('Patrick Stewart')
    })
    
    test('update artist with empty nationality', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ nationality: '' })
            .expect(204)

        const artist = await Artist.findById(artistId).populate('nationality')
        expect(artist.name).toBe('Patrick Stewart')
        expect(artist.nationality).toBeNull()
    })

    // test('update artist with unexistent country in nationality')


    // test('update artist changing its nationality')
})