import { Request, Response, NextFunction } from "express";
import { ILanguage, Language } from "../database/models/Language";

export const validateLanguages = async (req: Request, res: Response, next: NextFunction) => {

  if (req.body.languages !== undefined) {

    req.body.languages = [ ...new Set( req.body.languages )]

    let allLanguagesExist: boolean = true;
    let language: ILanguage | null;
    
    let objectSchemaLanguages: ILanguage[] = []
    for (let languageName of req.body.languages) {
      language = await Language.findOne({ name: languageName })

      if (!language)
        allLanguagesExist = false;
      else
        objectSchemaLanguages.push(language)
    }

    if (!allLanguagesExist)
      return res.status(400).json({ msg: 'Given language doesn\'t exist' })
    
    req.body.languages = objectSchemaLanguages
  }

  next()
}