
const request = require('supertest')
const server = require('../model/Server')
const Genre = require('../database/models/Genre')
const { genreData } = require('../database/seeders/seed-genre')
const { dbDisconnect } = require('../database/config')

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
        expect(res.body.length).toBe(12)
      })
  })
})