const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            authSource: "admin",
            user: process.env.MONGO_DB_USER,
            pass: process.env.MONGO_DB_PASSWORD
        });

        console.log('Connection established with MongoDB');
    } catch ( error ){
        console.error(error);
        throw new Error('Can\'t establish connection to MongoDB')
    }
}

module.exports = { dbConnection }