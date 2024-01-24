import { NextFunction, Request, Response } from "express";
import { IMovie, Movie } from "../database/models/Movie";

export const movieFind = async (req: Request, res: Response, next: NextFunction) : Promise<Response | void> => {

  const { movieId }: { movieId?: string} = req.params;

  const movie: IMovie | null = await Movie.findById(movieId).populate('cast');

  if (!movie) {
    return res.status(400).json({ msg: 'Given movie does not exist' })
  }

  req.movie = movie

  next()
}