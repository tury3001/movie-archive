import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer;

export const dbConnect = async () => {
  try {    
    let conn;
    if (process.env.NODE_ENV === 'test') {
      mongod = await MongoMemoryServer.create()
      const testUri = mongod.getUri()
      conn = await mongoose.connect(testUri)
    } else {
      
      const devUri = `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}`
      console.log(`>> Conectando a ${devUri}...`)

      conn = await mongoose.connect(devUri, {
        authSource: 'admin',
        user: process.env.MONGO_ROOT_USERNAME,
        pass: process.env.MONGO_ROOT_PASSWORD
      })

      console.log(`>> Connection established with MongoDB - Host: ${conn.connection.host}`)
    }
  } catch (error) {
    console.error(error)
    throw new Error('Can\'t establish connection to MongoDB')
  }
}

export const dbDisconnect = async () => {
  try {
    await mongoose.connection.close()
    if (mongod) {
      await mongod.stop()
    }
  } catch (err) {
    console.log(err)
  }
}
