import { Schema, model } from "mongoose";
import { IArtist } from "./Artist";
import { IGenre } from './Genre';
import { ICountry } from "./Country";
import { ILanguage } from "./Language";

export interface IMovie {
  title: string,
  year: number,
  director?: IArtist,
  cast?: IArtist[],
  genres?: IGenre[],
  countries?: ICountry[],
  languages?: ILanguage[],
  synopsis: string,
  comment: string,
  tags: string[]
}

const MovieSchema = new Schema({
  title: String,
  year: Number,
  director: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: false
  },
  cast: [{
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: false
  }],
  genres: [{
    type: Schema.Types.ObjectId,
    ref: 'Genre',
    required: false
  }],
  countries: [{
    type: Schema.Types.ObjectId,
    ref: 'Country',
    required: false
  }],
  languages: [{
    type: Schema.Types.ObjectId,
    ref: 'Language',
    required: false
  }],  
  synopsis: String,
  comment: String,
  tags: [String]  
})

MovieSchema.path('title').index({ text : true });

export const Movie = model<IMovie>('Movie', MovieSchema)
