const { Schema, model } = require('mongoose');

const MovieSchema = new Schema({
    title: String,
    year: Number,
    director: String,
    genre: String,
    country: String,
    language: String,
    synopsis: String,    
    comment: String
});

module.exports = model('Movie', MovieSchema);