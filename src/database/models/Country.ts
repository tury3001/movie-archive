import { Schema, model } from 'mongoose';

export interface ICountry {
  name: string,
  code: string
}

const CountrySchema = new Schema<ICountry>({
  name: String,
  code: String
})

export const Country = model<ICountry>('Country', CountrySchema);
