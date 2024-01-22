require('dotenv').config({ path: '../.env' })

const mongoose = require('mongoose')
const { dbConnect, dbDisconnect } = require('../database/config')
const { Seeder } = require('../database/seeders/Seeder')
const Movie = require('../database/models/Movie')
const Artist = require('../database/models/Artist')

const migrate = async () => {
  try {

    await dbConnect()
  
    console.log(`>> Deleting movies...`)
    const result = await Movie.deleteMany({})

    console.log(`>> Deleting artists...`)
    const result2 = await Artist.deleteMany({})
  
    console.log(`>> Seeding...`)
    const seeder = new Seeder()
    await seeder.seedAll()

  } catch ( error ) {
  
    console.error(error)
    throw new Error(`There was an error running the migrations`)
  
  } finally {
    console.log(`>> Disconnected from MongoDB`)
    await dbDisconnect()
  }
}

migrate()


