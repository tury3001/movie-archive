const request = require('supertest')
const server = require('../model/Server')
const { dbDisconnect } = require('../database/config')
const Artist = require('../database/models/Artist')

const app = server.getApp()

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

})

function getArtistData() {
  return {
    name: 'Hugh Jackman',
    gender: 'M',
    bornDate: '1968-10-12',
    bornPlace: 'Sydney, New South Wales, Australia',
    nationality: 'Australia',
    bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate nostrum enim voluptas architecto suscipit dicta natus maiores nemo similique fuga ullam molestiae cumque ipsa ad, distinctio in dignissimos explicabo eius.'
  }
}