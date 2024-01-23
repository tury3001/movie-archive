
const Country = require('../src/database/models/Country')
const { dbDisconnect } = require('../src/database/config')
const request = require('supertest')
const server = require('../src/model/Server')

const app = server.getApp()

afterAll(async () => {
  await dbDisconnect()
})

describe('Country get tests', () => {
  test('it should get all the countries in db', async () => {
    
    await Country.insertMany( getManyCountries() )

    await request(app)
      .get('/api/countries')
      .expect(200)
      .expect( (res) => {
        expect(res.body.length).toBe(7)
        expect(res.body[0].name).toBe('Australia')
        expect(res.body[0].code).toBe('AU')
        expect(res.body[3].name).toBe('Finland')
        expect(res.body[3].code).toBe('FI')
      })
  })
})

function getManyCountries() {
  return [
    { name: 'Australia', code: 'AU' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Finland', code: 'FI' },
    { name: 'Japan', code: 'JP' },
    { name: 'Switzerland', code: 'SW' },
    { name: 'Vanuatu', code: 'VA' }
  ]
}