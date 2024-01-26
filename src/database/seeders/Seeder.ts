import { Artist, Language, Country, Genre } from "../models";
import { movieData, artistData, languageData, countryData, genreData } from "./";
import { Movie } from "../models/Movie";
import { dbConnect, dbDisconnect } from '../config';
import dotenv from 'dotenv';

dotenv.config();

export class Seeder {
  async seedAll () {
    try {

      await dbConnect();     

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

      await dbDisconnect();

    } catch (error) {
      console.log(error)
    }
  }
}
