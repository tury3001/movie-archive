const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongod;

const dbConnect = async () => {

    let uri = process.env.MONGODB_CNN;
    let conn;

    try {

        if (process.env.NODE_ENV === 'test') {

            mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            console.log(`Conectando a ${ uri }`);
            conn = await mongoose.connect(uri);
        } else {

            conn = await mongoose.connect(uri, {
                authSource: 'admin',
                user: process.env.MONGO_DB_USER,
                pass: process.env.MONGO_DB_PASSWORD,
            });
        }
        console.log(`Connection established with MongoDB - Host: ${ conn.connection.host }`);
    } catch ( error ){
        console.error(error);
        throw new Error('Can\'t establish connection to MongoDB')
    }
}

const dbDisconnect = async () => {
    try {
        await mongoose.connection.close();
        if (mongod) {
          await mongod.stop();
        }
      } catch (err) {
        console.log(err);
    }
}

module.exports = { dbConnect, dbDisconnect }