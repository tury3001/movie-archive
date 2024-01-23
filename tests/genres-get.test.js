const request = require('supertest')
const server = require('../src/model/Server')
const Genre = require('../src/database/models/Genre')
const { genreData } = require('../src/database/seeders/seed-genre')
const { dbDisconnect } = require('../src/database/config')

const app = server.getApp()

afterAll(async () => {
  await dbDisconnect()
})

describe('genres tests', () => {
  test('it gets all the genres', async () => {

    await Genre.insertMany(genreData());

    await request(app)
      .get('/api/genres')
      .expect(200)
      .expect( (res) => {
        expect(res.body.length).toBe(13)
        expect(res.body[0].name).toBe('action')
        expect(res.body[4].name).toBe('drama')
      })
  })
})