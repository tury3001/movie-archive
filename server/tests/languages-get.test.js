const request = require('supertest')
const server = require('../model/Server')
const { dbDisconnect } = require('../database/config')
const { languageData } = require('../database/seeders/seed-language')
const Language = require('../database/models/Language')

const app = server.getApp()

afterAll(async () => {
  await dbDisconnect()
})

describe('languages tests', () => {
  test('it gets all the languages', async () => {

    await Language.insertMany(languageData())    

    await request(app)
      .get('/api/languages')
      .expect(200)
      .expect( (res) => {
        expect(res.body.length).toBe(182)
        expect(res.body[0].name).toBe('Afar')
        expect(res.body[69].name).toBe('Icelandic')
        expect(res.body[69].code).toBe('is')
      })
  })
})