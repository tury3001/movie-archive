const mongoose = require('mongoose');

const Genre = require('../models/Genre')
const Country = require('../models/Country');
const Language = require('../models/Language');

const { genreData } = require('./seed-genre');
const { countryData } = require('./seed-country');
const { languageData } = require('./seed-language');

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

            console.log('--> Seeding countries...');
            await Country.deleteMany({});
            await Country.insertMany( countryData() );

            console.log('--> Seeding languages...');
            await Language.deleteMany({});
            await Language.insertMany( languageData() );
            

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

