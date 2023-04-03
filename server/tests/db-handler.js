const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongod;

const connect = async () => {
    mongod = await MongoMemoryServer.create();
    console.log('Mongod URI: ' + mongod.getUri());
    const uri = mongod.getUri();

    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'movies'
    };

    await mongoose.connect(uri, mongooseOpts);
}

const disconnect = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
}

const dropCollections = async () => {
    if (mongod) {
        const collections = await mongoose.connection.db.collections();
    
        // for (let collection of collections) {
        //     await collection.remove();
        // }
    }
};

module.exports = { connect, disconnect, dropCollections }