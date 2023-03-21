const axios = require('axios');

describe('route tests', () => {
    test('get to /api/movie should return a 200 status code', async () => {        
        const res = await axios.get('http://localhost:6868/api/movie');
        expect(res.status).toBe(200);
    });
});