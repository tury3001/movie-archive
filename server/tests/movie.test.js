const axios = require('axios');
const baseUrl = process.env.DEV_BASE_URL;

describe('movie tests', () => {

    test('get to /api/movie should return a 200 status code and json response', async () => {       
        const res = await axios.get(`${ baseUrl }/api/movie`);
        expect(res.status).toBe(200);
        expect(res.data).toEqual({ message: 'ok' });
    });

    test('add new movie with empty title', async () => {

        let movieData = getMovieData();
        movieData.title = '';

        const res = await postToMovieEndpoint(movieData);

        expect(res.status).toBe(400);
        expect(res.data.errors[0].msg).toBe('Title can\'t be empty');
    });

    test('add new movie with a title greater than the max limit', async () => {

        let movieData = getMovieData();
        movieData.title = 'E'.repeat(81);

        const res = await postToMovieEndpoint(movieData);

        expect(res.status).toBe(400);
        expect(res.data.errors[0].msg).toBe('Title can\'t be longer than 80 characters');
    });

    test('add new movie with empty year', async () => {
        let movieData = getMovieData();
        movieData.year = null;

        const res = await postToMovieEndpoint(movieData);

        expect(res.status).toBe(400);
        expect(res.data.errors[0].msg).toBe('Year can\'t be empty');
    });

    test('add new movie with non numeric year', async () => {
        let movieData = getMovieData();
        movieData.year = 'this is not a year';

        const res = await postToMovieEndpoint(movieData);

        expect(res.status).toBe(400);
        expect(res.data.errors[0].msg).toBe('The year must be a number between 1895 and 3000');
    });

    test('add new movie with a year less than 1895', async() => {
        let movieData = getMovieData();
        movieData.year = 1894;
        
        const res = await postToMovieEndpoint(movieData);
        expect(res.status).toBe(400);
        expect(res.data.errors[0].msg).toBe('The year must be a number between 1895 and 3000');
    });

    test('add new movie with empty director', async() => {
        let movieData = getMovieData();
        movieData.director = '';

        const res = await postToMovieEndpoint(movieData);
        expect(res.status).toBe(201);
    });

    test('add new movie with a director string longer than 60 characters', async() => {
        let movieData = getMovieData();
        movieData.director = 'E'.repeat(81);

        const res = await postToMovieEndpoint(movieData);
        expect(res.status).toBe(400);        
        expect(res.data.errors[0].msg).toBe('The director\'s name can\'t have more than 80 characters');
    });

    test('add new movie with empty set of genres', async() => {
        let movieData = getMovieData();
        movieData.genres = [];

        const res = await postToMovieEndpoint(movieData);

        expect(res.status).toBe(201);
    });

    test('add new movie with empty genres', async() => {
        let movieData = getMovieData();
        movieData.genres = [ 'western', null ];

        const res = await postToMovieEndpoint(movieData);

        expect(res.status).toBe(400);
    });

    test('add new movie with invalid genres', async() => {
        let movieData = getMovieData();
        movieData.genres = [ 4233, 12 ];

        const res = await postToMovieEndpoint(movieData);

        expect(res.status).toBe(400);
    });

    async function postToMovieEndpoint(movieData) {
        return await axios.post(`${baseUrl}/api/movie`, movieData, getAxiosOptions());
    }

    function getAxiosOptions() {
        return {
            validateStatus: () => true, // avoids axios exception throws
        }
    }

    function getMovieData() {
        return {
            title: 'Jurassic Park',
            year: 1993,
            director: 'Steven Spielberg',
            genres: ['adventure', 'sci-fi'],
            countries: ['United States'],
            languages: ['english']
        }
    }
});



