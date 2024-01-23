const request = require('supertest')
const server = require('../src/model/Server')
const Country = require('../src/database/models/Country')
const Artist = require('../src/database/models/Artist')
const { dbDisconnect } = require('../src/database/config')
const { countryData } = require('../src/database/seeders/seed-country')
const { getArtistData, getManyArtists } = require('./samples/artist-data-sample')

const app = server.getApp()

let artistId
let artistData
let country

beforeAll( async () => {
    await Country.insertMany(countryData())
    await Artist.deleteMany({})

    artistData = getArtistData(0)
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

    test('update artist with invalid id', async () => {
        await request(app)
            .patch('/api/artist/invalid-id')
            .send({ name: 'William Shatner' })
            .expect(400)
            .expect( res => {
                expect(res.body.errors[0].msg).toBe('Given id is invalid')
            })
    })

    test('update artist with valid id but unexistent artist', async () => {

        let artistToUpdate = getManyArtists()[1]
        artistToUpdate.nationality = await Country.findOne({ name: artistToUpdate.nationality })._id

        const { _id } = await Artist.create(artistToUpdate)

        await Artist.deleteOne(_id)

        await request(app)
            .patch(`/api/artist/${ _id }`)
            .send({ name: 'William Shatner' })
            .expect(400)
            .expect( res => {
                expect(res.body.msg).toBe('Artist does not exist')
            })
    })

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

    test('update artist with without born date', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ name: 'Ricardo Darin' })
            .expect(204)

        const artist = await Artist.findById(artistId)
        expect(artist.name).toBe('Ricardo Darin')
        expect(artist.bornDate).not.toBeNull()
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

    test('update artist with unexistent country in nationality', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ nationality: 'Wakanda' })
            .expect(400)
            .expect( res => {
                expect(res.body.msg).toBe('Given nationality does not exist')
            })

        const artist = await Artist.findById(artistId).populate('nationality')
        expect(artist.name).toBe('Patrick Stewart')
        expect(artist.nationality.name).toBe('United Kingdom')
    })

    test('update artist changing its nationality', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ nationality: 'France' })
            .expect(204)

        const artist = await Artist.findById(artistId).populate('nationality')
        expect(artist.name).toBe('Patrick Stewart')
        expect(artist.nationality.name).toBe('France')
    })

    test('update artist with empty bio is possible', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ bio: 'A new bio' })
            .expect(204)

        const artist = await Artist.findById(artistId)
        expect(artist.bio).toBe('A new bio')        
    })

    test('update artist with bio greater than 512 characters is not possible', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ bio: 's'.repeat(513) })
            .expect(400)
            .expect( res => {
                expect(res.body.errors[0].msg).toBe('Artist bio can\'t be longer than 512 characters')
            })
    })

    test('update artist without bio maintains bio the same', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ name: 'Ricardo Darin' })
            .expect(204)

        const artist = await Artist.findById(artistId)
        expect(artist.name).toBe('Ricardo Darin')
        expect(artist.bio).toBe('Stewart gained stardom for his leading role as Captain Jean-Luc Picard in Star Trek: The Next Generation (1987–94), its subsequent films, and Star Trek: Picard (2020–23).')
    })

    test('update artist bio with valid bio', async () => {
        await request(app)
            .patch(`/api/artist/${ artistId }`)
            .send({ bio: 'A different bio' })
            .expect(204)

        const artist = await Artist.findById(artistId)
        expect(artist.bio).toBe('A different bio')
    })
})