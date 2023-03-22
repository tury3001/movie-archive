const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        console.log('Conectando a: ');
        console.log(process.env.MONGODB_CNN);
        await mongoose.connect( process.env.MONGODB_CNN );

        console.log('Connection established with MongoDB')
    } catch ( error ){
        console.error(error)
        throw new Error('Can\'t establish connection to MongoDB')
    }
}

module.exports = { dbConnection }