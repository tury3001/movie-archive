import { Schema, model } from 'mongoose';

export interface IArtist {
  _id?: string,
  name: string,
  gender: string,
  bornDate: Date,
  bornPlace: String,
  nationality: Schema.Types.ObjectId
  bio: string
}

const ArtistSchema = new Schema<IArtist>({
  name: {
    type: String,
    required: true
  },
  gender: String,
  bornDate: Date,
  bornPlace: String,
  nationality: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
    required: false
  },
  bio: String
})

export const Artist = model<IArtist>('Artist', ArtistSchema)