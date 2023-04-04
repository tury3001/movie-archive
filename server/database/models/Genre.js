const { Schema, model } = require('mongoose');

const Genre = new Schema({
    name: String
});

module.exports = model('Genre', Genre);
