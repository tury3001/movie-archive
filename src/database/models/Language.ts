import { Schema, model } from 'mongoose';

export interface ILanguage {
  name: string,
  code: string
}

const LanguageSchema = new Schema<ILanguage>({
  name: String,
  code: String
})

export const Language = model<ILanguage>('Language', LanguageSchema);
