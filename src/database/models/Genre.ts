import { Schema, model } from 'mongoose';

export interface IGenre {
  name: string
}

const GenreSchema = new Schema<IGenre>({
  name: String
})

export const Genre = model<IGenre>('Genre', GenreSchema);
