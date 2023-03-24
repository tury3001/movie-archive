const axios = require('axios');

describe('movie tests', () => {
    test('get to /api/movie should return a 200 status code and json response', async () => {        
        const res = await axios.get(`http://localhost:3000/api/movie`)
        expect(res.status).toBe(200)
        expect(res.data).toEqual({ message: 'ok' })
    });

    test('add new movie with empty title', async () => {
        const res = await axios.post(`http://localhost:3000/api/movie`, {
            title: ''
        },
        {
            validateStatus: () => true, // avoids axios exception throws
        });

        expect(res.status).toBe(400)
        expect(res.data.errors[0].msg).toBe('Title can\'t be empty')
    });

    test('add new movie with a title greater than the max limit', async () => {
        const res = await axios.post(`http://localhost:3000/api/movie`, {
            title: 'E'.repeat(81)
        },
        {
            validateStatus: () => true, // avoids axios exception throws
        });

        expect(res.status).toBe(400)
        expect(res.data.errors[0].msg).toBe('Title can\'t be longer than 80 characters')
    });
});

