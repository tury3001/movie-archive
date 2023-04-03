const request = require('supertest');
const server = require('../model/Server');
const { dbDisconnect } = require('../database/config');

const app = server.getApp();

beforeAll( async () => {
   
});

afterAll( async () => {
   await dbDisconnect();
});

describe('get movie tests', () => {    

    test('get to /api/movie should return a 200 status code and json response', async () => {
        request(app).get('/api/movie')
            .expect(200)
            .expect({ message: 'ok' });
    });
});