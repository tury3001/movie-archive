const request = require('supertest')
const server = require('../src/model/Server')
const { dbDisconnect } = require('../src/database/config')
const { languageData } = require('../src/database/seeders/seed-language')
const Language = require('../src/database/models/Language')

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