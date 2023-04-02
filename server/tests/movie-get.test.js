

const request = require('supertest');

const baseUrl = process.env.DEV_BASE_URL;

describe('get movie tests', () => {    

    test('get to /api/movie should return a 200 status code and json response', async () => {
        request(baseUrl).get('/api/movie')
            .expect(200)
            .expect({ message: 'ok' });
    });
});