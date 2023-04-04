const mongoose = require('mongoose');
const Genre = require('../models/Genre');


const { genreModel, genreData } = require('./seed-genre');

const uri = 'mongodb://localhost:27017/movie-archive';
const user = 'mvarchive';
const pass = 'z59mHfsaZbyc4Kzh';

class Seeder {

    async seedAll() {

        try {
            await this.connect();

            console.log('--> Seeding genres...');

            await Genre.deleteMany({});
            await Genre.insertMany( genreData() );

        } catch ( error ) {
            console.log( error );
        } finally {
            await this.disconnect();
        }
    }

    async connect() {

        await mongoose.connect( uri, {
            authSource: 'admin',
            user,
            pass
        });

    }

    async disconnect() {
        await mongoose.connection.close();
    }
}

const seeder = new Seeder();
seeder.seedAll();

