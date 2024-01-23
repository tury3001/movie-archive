const request = require('supertest')
const server = require('../src/model/Server')
const { dbDisconnect } = require('../src/database/config')
const Artist = require('../src/database/models/Artist')
const Country = require('../src/database/models/Country')
const { countryData } = require('../src/database/seeders/seed-country')

const app = server.getApp()

beforeAll( async () => {
  await Country.insertMany(countryData())
})

afterAll(async () => {
  await dbDisconnect()  
})

afterEach(async () => {
  await Artist.deleteMany({})
})

describe('add artist tests', () => {
  test('add new artist with ok data', async () => {
    await request(app)
      .post('/api/artist')
      .send(getArtistData())
      .expect(201)

    expect(await Artist.count({})).toBe(1);
  })

  test('add artist with empty name', async () => {

    let artistData = getArtistData()
    artistData.name = ''
  
    await request(app)
      .post('/api/artist')
      .send(artistData)
      .expect(400)
      .expect( (res) => {
        expect(res.body.errors[0].msg).toBe('Artist name can\'t be empty')
      })
  })

  test('add artist with a name\'s length greater than 60', async () => {
    let artistData = getArtistData()
    artistData.name = 's'.repeat(61)

    await request(app)
      .post('/api/artist')
      .send(artistData)
      .expect(400)
      .expect( (res) => {
        expect(res.body.errors[0].msg).toBe('Artist name can\'t have more than 60 characters')
      })
  })

  test('add artist with empty gender', async () => {
      let artistData = getArtistData()
      artistData.gender = ''

      await request(app)
        .post('/api/artist')
        .send(artistData)
        .expect(400)
        .expect( (res) => {
            expect(res.body.errors[0].msg).toBe('Artist gender can\'t be empty')
        })
  })

  test('add artist with invalid gender type', async () => {
      let artistData = getArtistData()
      artistData.gender = 'L'
      
      await request(app)
        .post('/api/artist')
        .send(artistData)
        .expect(400)
        .expect( (res) => {
          expect(res.body.errors[0].msg).toBe('Artist gender must be either F or M')
        })   
  })

  test('add artist with invalid born date', async () => {
    let artistData = getArtistData()
    artistData.bornDate = 'some invalid string'

    await request(app)
      .post('/api/artist')
      .send(artistData)
      .expect(400)
      .expect( (res) => {
          expect(res.body.errors[0].msg).toBe('Artist born date must be a valid date')
      })
  })

  test('add artist with empty born date', async () => {
      let artistData = getArtistData()
      artistData.bornDate = null

      await request(app)
        .post('/api/artist')
        .send(artistData)
        .expect(201)
  })

  test('add artist with empty born place', async () => {
      let artistData = getArtistData()
      artistData.bornPlace = null

      await request(app)
        .post('/api/artist')
        .send(artistData)
        .expect(201)
  })

  test('add artist with born place length longer than 60 characters', async () => {
      let artistData = getArtistData()
      artistData.bornPlace = 's'.repeat(61)

      await request(app)
        .post('/api/artist')
        .send(artistData)
        .expect(400)
        .expect( (res) => {
          expect(res.body.errors[0].msg).toBe('Artist born place length can\'t be greater than 60 characters')
        })
  })

  test('add artist with empty country', async () => {
      let artistData = getArtistData()
      artistData.nationality = null

      await request(app)
        .post('/api/artist')
        .send(artistData)
        .expect(201)
  })

  test('add artist creates a reference to Country in nationality property', async () => {
    let artistData = getArtistData()
    artistData.nationality = 'Argentina'

    await request(app)
      .post('/api/artist')
      .send(artistData)

    const artist = await Artist.findOne({ name: 'Hugh Jackman'}).populate('nationality')
    expect(artist.nationality.name).toBe('Argentina')
  })

  test('add artist returns error if Country does not exist', async () => {
    let artistData = getArtistData()
    artistData.nationality = 'Alto Volta'

    await request(app)
      .post('/api/artist')
      .send(artistData)
      .expect(400)
      .expect( (res) => {
        expect(res.body.msg).toBe('Given nationality does not exist')
      })
  })

  test('add artist with empty bio', async () => {
      let artistData = getArtistData()
      artistData.bio = null

      await request(app)
        .post('/api/artist')
        .send(artistData)
        .expect(201)
  })

  test('add artist with empty length longer than 512 characters', async () => {
    let artistData = getArtistData()
    artistData.bio = 's'.repeat(513)

    await request(app)
      .post('/api/artist')
      .send(artistData)
      .expect(400)
      .expect( (res) => {
        expect(res.body.errors[0].msg).toBe('Artist bio can\'t be longer than 512 characters')
      })
  })

  test('add duplicated artist returns a 400 status code', async () => {

    const artistData = getArtistData()
    artistData.nationality = await Country.findOne({ name: 'Australia' })
    await Artist.create(artistData)
    
    await request(app)
      .post('/api/artist')
      .send(getArtistData())
      .expect(400)
  })
})

function getArtistData() {
  return {
    name: 'Hugh Jackman',
    gender: 'M',
    bornDate: '1968-10-12',
    bornPlace: 'Manhattan, New York, United States',
    nationality: 'United States',
    bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate nostrum enim voluptas architecto suscipit dicta natus maiores nemo similique fuga ullam molestiae cumque ipsa ad, distinctio in dignissimos explicabo eius.'
  }
}