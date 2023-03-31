const Movie = require('../database/models/movie');

const add = async (req, res) => {

    const { title, year, director, genres, countries, languages, comment, synopsis, tags } = req.body;

    const data = {
        title,
        year,
        director,
        genre: genres[0],
        countries: countries[0],
        languages: languages[0],
        comment,
        synopsis,
        tags
    }

    try {
        const movie = await new Movie( data );
        await movie.save();
        console.log('Movie saved!');
    } catch (error) {
        console.log('Movie can\'t be saved');
        console.log(error);
    }
    

    res.status(201).json({ message: 'Movie has been saved'} )
}

module.exports = { add }