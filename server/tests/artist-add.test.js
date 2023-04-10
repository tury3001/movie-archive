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
      .expect(201)

    expect(await Artist.count({})).toBe(1);
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