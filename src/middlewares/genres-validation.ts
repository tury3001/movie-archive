import { NextFunction, Request, Response } from "express";
import { Genre, IGenre } from "../database/models/Genre";

export const validateGenres = async(req: Request, res: Response, next: NextFunction) => {  

  if (req.body.genres !== undefined) {

    const genres = [ ...new Set( req.body.genres) ];

    let objectGenres: IGenre[] = [];
    let objGenre: IGenre | null;
    let genreExists: boolean = true;

    if (req.body.genres && req.body.genres.length > 0) {
      for (let genre of genres) {
        objGenre = await Genre.findOne({ name: genre });
        objGenre ? objectGenres.push(objGenre) : genreExists = false;
      }
    }

    if (!genreExists)
      return res.status(400).json({ msg: 'Given genre doesn\'t exist' })

    req.body.genres = objectGenres
  }

  next()
}