import { NextFunction, Request, Response } from "express";
import { Artist, IArtist } from "../database/models/Artist";

export const attachDirector = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.director) {
      const artist: IArtist | null = await Artist.findById(req.body.director);

      if (artist) req.body.director = artist;
      else return res.status(400).json({ msg: "Given director doesn't exist" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "There was an error trying to get the director" });
  }

  next();
};
