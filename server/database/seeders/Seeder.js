const Genre = require('../models/Genre')
const Country = require('../models/Country')
const Language = require('../models/Language')
const Artist = require('../models/Artist')

const { genreData } = require('./seed-genre')
const { countryData } = require('./seed-country')
const { languageData } = require('./seed-language')
const { artistData } = require('./seed-artists')
const { movieData } = require('./seed-movie')
const Movie = require('../models/Movie')

class Seeder {
  async seedAll () {
    try {

      console.log('--> Seeding genres...')
      await Genre.deleteMany({})
      await Genre.insertMany(genreData())

      console.log('--> Seeding countries...')
      await Country.deleteMany({})
      await Country.insertMany(countryData())

      console.log('--> Seeding languages...')
      await Language.deleteMany({})
      await Language.insertMany(languageData())      

      console.log('--> Seeding artists...')
      await Artist.deleteMany({})
      const artists = await Artist.insertMany(artistData())

      const director = artists[2]._id
      let cast = []
      cast.push(artists[0]._id, artists[1]._id)

      console.log('--> Seeding movies...')
      await Movie.deleteMany({})
      await Movie.insertMany(movieData(director, cast))

    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = { Seeder }
